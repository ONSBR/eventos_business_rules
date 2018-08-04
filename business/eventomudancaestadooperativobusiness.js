const UtilCalculoParametro = require('./utilcalculoparametro');
const extensions = require("./extensions");
const ESTADOS_OPERATIVOS_DESLIGADO_EXCETO_DCO = ['DEM', 'DUR', 'DAU', 'DCA', 'DPR', 'DPA', 'DAP', 'DES', 'DOM'];

class EventoMudancaEstadoOperativoBusiness {


    aplicarRegras(eventos) {
        this.preencherCampoDisponibilidadeVazio(eventos);
        this.refletirAlteracaoDeUltimoEventoEmEventoespelho(eventos);
        this.refletirAlteracoesQuandoUltimoEventoMesExcluido(eventos);
        this.excluirEventosConsecutivosSemelhantes(eventos);
        this.verificarUnicidadeEventoEntradaOperacaoComercial(eventos);
        this.verificarEventoDCOAposLig(eventos);
        this.verificarPotenciaNegativaOuSuperiorPotencia(eventos);
        this.verificarCondicaoOperativa(eventos);
        this.verificarClassificacaoOrigem(eventos);
        this.verificarCondicaoOperacaoOperativaRPROuRFO(eventos);
        this.verificarEstadoOperativoDesligamento(eventos);
        this.verificarEventosNaMesmaDataHora(eventos);
        this.verificarEventosConsecutivos(eventos);
    }

    aplicarRegrasCenario(eventos){
        this.verificarUnicidadeEventoEntradaOperacaoComercial(eventos);
        this.excluirEventosConsecutivosSemelhantes(eventos); 
    }

    /**
     * RNI080 - Entrada em Operação Comercial de um equipamento. 
     * É obrigatória a existência de um, e somente um, evento com o estado operativo EOC para 
     * indicar a entrada em operação comercial de um equipamento.
     * @param {EventoMudancaEstadoOperativo[]} eventos - array de eventos.
     */
    verificarUnicidadeEventoEntradaOperacaoComercial(eventos) {
        let eventosEOC = eventos.filter(evento => {
            return this.isEventoEOC(evento);
        });

        if (eventosEOC.length != 1) {
            throw new Error('É obrigatória a existência de um, e somente um, evento com o estado operativo EOC.');
        }

        let eventosSimultaneosEOC = eventos.filter(evento => {
            return !this.isEventoEOC(evento) && evento.dataVerificada.getTotalSeconds() == eventosEOC[0].dataVerificada.getTotalSeconds();
        });
        
        if (eventosSimultaneosEOC.length == 0) {
            throw new Error('Deve existir um evento com a mesma data/hora do evento EOC.');
        }
    }

    isEventoEOC(evento) {
        return evento.idEstadoOperativo == 'EOC';
    }

    /**
     * RNH132 - Campo Disponibilidade vazio. 
     * A Disponibilidade dos eventos com Condição Operativa “NOR”, “NOT” e “TST” 
     * será sempre preenchida pelo sistema com a potência vigente na data verificada do evento.
     * A Disponibilidade dos eventos de com Estado Operativo de desligamento (exceto DCO) será 
     * sempre preenchida pelo sistema com zero.
     * @param {EventoMudancaEstadoOperativo} evento - Evento de mudança de estado operativo.
     */
    preencherCampoDisponibilidadeVazio(evento, uge) {
        if (!evento.potenciaDisponivel && !this.isEventoExclusao(evento)) {
            const NOR_NOT_TST = ['NOR', 'NOT', 'TST'];
            if (NOR_NOT_TST.includes(evento.idCondicaoOperativa)) {
                evento.potenciaDisponivel = uge.potenciaDisponivel;
                this.preencherOperacaoParaAtualizacao(evento);
            } else if (ESTADOS_OPERATIVOS_DESLIGADO_EXCETO_DCO.includes(evento.idEstadoOperativo)) {
                evento.potenciaDisponivel = 0;
                this.preencherOperacaoParaAtualizacao(evento);
            } 
        }
    }

    preencherOperacaoParaAtualizacao(evento) {
        if(!evento.operacao) {
            evento.operacao = 'A';
        }
    }

    /**
     * RNI083 - Evento DCO após LIG. 
     * Um evento de Mudança de Estado Operativo com Estado Operativo “DCO” posterior a um evento com 
     * Estado Operativo “LIG” e Condição Operativa “RFO” ou “RPR” deve ter a mesma Condição Operativa, 
     * origem e valor de Disponibilidade do evento predecessor, exceto se for Origem “GRE”.
     * @param {EventoMudancaEstadoOperativo[]} eventosMudancasEstadosOperativos - array de eventos.
     */
    verificarEventoDCOAposLig(eventos) {
        if (eventos.length > 1) {
            for (let i = 1; i < eventos.length; i++) {
                return this.compararEventosDCOLIG(eventos[i - 1], eventos[i]);
            }
        }
    }

    compararEventosDCOLIG(eventoAnterior, evento) {
        if (eventoAnterior.idEstadoOperativo == 'LIG' && (eventoAnterior.idCondicaoOperativa == 'RFO' || eventoAnterior.idCondicaoOperativa == 'RPR')
            && eventoAnterior.idClassificacaoOrigem != 'GRE' && evento.idEstadoOperativo == 'DCO') {

            if (!(eventoAnterior.idCondicaoOperativa == evento.idCondicaoOperativa &&
                eventoAnterior.idClassificacaoOrigem == evento.idClassificacaoOrigem &&
                eventoAnterior.potenciaDisponivel == evento.potenciaDisponivel)) {
                throw new Error('Um evento de Mudança de Estado Operativo com Estado Operativo “DCO” posterior' +
                    ' a um evento com Estado Operativo “LIG” e Condição Operativa “RFO” ou “RPR” deve ter a mesma Condição Operativa,' +
                    ' origem e valor de Disponibilidade do evento predecessor, exceto se for Origem “GRE”');
            }

        }
    }

    /**
     * RNH064 - Reflexão de alteração de último evento em evento espelho
     * @param {EventoMudancaEstadoOperativo[]} eventosMudancasEstadosOperativos - array de eventos.
     */
    refletirAlteracaoDeUltimoEventoEmEventoespelho(eventos) {
        for (let i = 0; i < eventos.length; i++) {
            if (this.isEventoAlteracao(eventos[i]) && this.isUltimoEventoMes(eventos[i], eventos[i + 1])) {
                this.refletirAlteracoesParaEventosEspelhos(eventos[i], eventos, i + 1);
            }
        }
    }

    refletirAlteracoesParaEventosEspelhos(eventoAlterado, eventos, indicePosteriorEventoAlterado) {
        for (let i = indicePosteriorEventoAlterado; i < eventos.length; i++) {
            if (this.isEventoEspelho(eventos[i - 1], eventos[i])) {
                eventos[i].idClassificacaoOrigem = eventoAlterado.idClassificacaoOrigem;
                eventos[i].idEstadoOperativo = eventoAlterado.idEstadoOperativo;
                eventos[i].idCondicaoOperativa = eventoAlterado.idCondicaoOperativa;
                eventos[i].potenciaDisponivel = eventoAlterado.potenciaDisponivel;
                eventos[i].operacao = 'AA';
            }
        }
    }

    isEventoEspelho(eventoAnterior, evento) {
        return eventoAnterior != undefined &&
            eventoAnterior.dataVerificada.getMonth() != evento.dataVerificada.getMonth() &&
            evento.dataVerificada.getDate() == 1 && evento.dataVerificada.getHours() == 0 && evento.dataVerificada.getMinutes() == 0;
    }

    isEventoAlteracao(evento) {
        return evento.operacao == 'A';
    }

    isUltimoEventoMes(evento, eventoPosterior) {
        return eventoPosterior != undefined &&
            evento.dataVerificada.getMonth() != eventoPosterior.dataVerificada.getMonth();
    }

    /**
     * RNI095 - Exclusão do evento origem do "Evento-Espelho"
     * Caso o evento origem do"Evento-Espelho" seja excluído, ele passará a acompanhar as alterações do ‘novo’ último evento do mês anterior.
     * @param {EventoMudancaEstadoOperativo[]} eventosMudancasEstadosOperativos - array de eventos.
     */
    refletirAlteracoesQuandoUltimoEventoMesExcluido(eventos) {
        for (let i = 0; i < eventos.length; i++) {
            if (this.isEventoExclusao(eventos[i]) && this.isUltimoEventoMes(eventos[i], eventos[i + 1])) {
                this.refletirAlteracoesParaEventosEspelhos(eventos[i - 1], eventos, i + 1);
            }
        }
    }

    isEventoExclusao(evento) {
        return evento.operacao == 'E';
    }

    /**
     * RNI205 - Eventos de mudança de estado operativo consecutivos com os mesmos valores de estado operativo, condição operativa, 
     * origem e disponibilidade: Caso existam eventos de mudança de estado operativo consecutivos com os mesmos valores de estado 
     * operativo, condição operativa, origem e disponibilidade, exceto no caso do evento espelho, preservar o primeiro evento e 
     * excluir os demais eventos consecutivos que estão com os mesmos valores de estado operativo, condição operativa, 
     * origem e disponibilidade, exceto o evento espelho.
     * @param {EventoMudancaEstadoOperativo[]} eventosMudancasEstadosOperativos - array de eventos.
     */
    excluirEventosConsecutivosSemelhantes(eventos) {
        for (let i = 0; i < eventos.length; i++) {
            if (eventos[i + 1] != undefined) {
                if (eventos[i].idEstadoOperativo == eventos[i + 1].idEstadoOperativo &&
                    eventos[i].idCondicaoOperativa == eventos[i + 1].idCondicaoOperativa &&
                    eventos[i].idClassificacaoOrigem == eventos[i + 1].idClassificacaoOrigem &&
                    eventos[i].potenciaDisponivel == eventos[i + 1].potenciaDisponivel && !this.isEventoEspelho(eventos[i], eventos[i + 1])) {
                    eventos[i + 1].operacao = 'E';
                }
            }
        }
    }
    
    /**
     * RNR063 - Restrição ao COSR quanto a retificações/revisões diretas em eventos espelho:
     * Não são permitidas ao ator COSR retificações/revisões diretamente em eventos-espelho (evento zero-hora).
     * @param {EventoMudancaEstadoOperativo[]} eventos
     */
    validarAlteracoesDiretasEventosEspelhos(eventos) {
        if (eventos.length > 1) {
            for (let i = 1; i < eventos.length; i++) {
                if (this.isEventoAlteracao(eventos[i]) && this.isEventoEspelho(eventos[i - 1], eventos[i])) {
                    throw new Error('Não são permitidas ao ator COSR retificações/revisões diretamente em eventos-espelho (evento zero-hora).');
                }
            }
        }
    }

    /**
     * RNR069 - Eventos sem valores de potência vigente ou demais parâmetros.
     * @param {EventoMudancaEstadoOperativo[]} eventos 
     */
    verificarAtributosObrigatorios(eventos) {
        for (let i = 0; i < eventos.length; i++) {

            if (eventos[i].potenciaDisponivel == undefined) {
                throw new Error('Valor disponibilidade deve ser preenchido.');
            }

            if (eventos[i].dataVerificada == undefined) {
                throw new Error('Data deve ser preenchida.');
            }

            if (eventos[i].idEstadoOperativo == undefined) {
                throw new Error('Estado operativo deve ser preenchido.');
            }

        }
    }

    /**
     * RNR070 - Restrição de Mudança de Estado Operativo sem valor ou com valor negativo.
     * @param {UnidadeGeradora} unidadeGeradora 
     * @param {EventoMudancaEstadoOperativo[]} eventos 
     */
    verificarPotenciaNegativaOuSuperiorPotencia(unidadeGeradora, eventos) {
        for (let i = 0; i < eventos.length; i++) {

            if (eventos[i].potenciaDisponivel < 0) {
                throw new Error('Valor disponibilidade não pode ser negativo.');
            }

            if (eventos[i].potenciaDisponivel > unidadeGeradora.potenciaDisponivel) {
                throw new Error('Valor disponibilidade superior a da unidade geradora.');
            }

        }
    }

    /**
     * RNR071 - Restrição de evento de mudança de estado operativo sem condição operativa.
     * @param {EventoMudancaEstadoOperativo[]} eventos  
     */
    verificarCondicaoOperativa(eventos) {
        let estadosOperativos = ['LIG', 'LCS', 'LCC', 'LCI', 'DCO', 'RDP'];

        eventos.forEach(evento => {
            if (estadosOperativos.includes(evento.idEstadoOperativo) &&
                (evento.idCondicaoOperativa == undefined || evento.idCondicaoOperativa == '')) {
                throw new Error('Não pode haver evento de Mudança de Estado Operativo sem a Condição Operativa preenchida ' +
                    'quando o estado operativo for igual a “LIG”, “LCS”, “LCC”, “LCI”, “DCO” ou “RDP”.');
            }
        });
    }

    /**
     * RNR072 - Restrição de evento de mudança de estado operativo sem origem.
     * @param {EventoMudancaEstadoOperativo[]} eventos  
     */
    verificarClassificacaoOrigem(eventos) {
        let estadosOperativos = ['DEM', 'DUR', 'DAU', 'DPR', 'DPA', 'DCA'];

        eventos.forEach(evento => {
            if (estadosOperativos.includes(evento.idEstadoOperativo) &&
                (evento.idClassificacaoOrigem == undefined || evento.idClassificacaoOrigem == '')) {
                throw new Error('Não pode haver evento de Mudança de Estado Operativo sem a Origem preenchida quando o estado ' +
                    'operativo for igual a “DEM”, “DUR”, “DAU”, “DPR”, “DPA” ou “DCA”.');
            }
        });
    }

    /**
     * RNR073 - Restrição de evento de mudança de estado operativo sem dados preenchidos: Não pode haver evento de 
     * Mudança de Estado Operativo com Condição Operativa RPR ou RFO e sem valor de Disponibilidade e Origem.
     * @param {EventoMudancaEstadoOperativo[]} eventos  
     */
    verificarCondicaoOperacaoOperativaRPROuRFO(eventos) {
        let condicoesOperativas = ['RPR', 'RFO'];

        eventos.forEach(evento => {
            if (condicoesOperativas.includes(evento.idCondicaoOperativa) && (evento.potenciaDisponivel == undefined ||
                evento.idClassificacaoOrigem == undefined)) {
                throw new Error('Não pode haver evento de Mudança de Estado Operativo com Condição Operativa RPR ou RFO e sem' +
                    ' valor de Disponibilidade, Origem');
            }
        });

    }

    /**
     * RNR078 - Estado Operativo de desligamento e condição operativa.
     * @param {EventoMudancaEstadoOperativo[]} eventos 
     */
    verificarEstadoOperativoDesligamento(eventos) {
        eventos.forEach(evento => {
            if (ESTADOS_OPERATIVOS_DESLIGADO_EXCETO_DCO.includes(evento.idEstadoOperativo) &&
                (UtilCalculoParametro.isCampoStringPreenchido(evento.idCondicaoOperativa) ||
                    evento.potenciaDisponivel != 0 ||
                    !UtilCalculoParametro.isCampoStringPreenchido(evento.idClassificacaoOrigem))) {
                throw new Error('Um evento de Mudança de Estado Operativo com Estado Operativo de Desligamento, exceto “DCO”,' +
                    ' tem que ter: Condição Operativa em branco, Valor de Disponibilidade igual a zero e Origem preenchida.');
            }
        });
    }

    /**
     * RNR078 - Estado Operativo de desligamento e condição operativa.
     * @param {EventoMudancaEstadoOperativo[]} eventos 
     */
    verificarEventosNaMesmaDataHora(eventos) {
        for (let i = 0; i < eventos.length; i++) {
            if (!this.isEventoEOC(eventos[i])) {
                for (let j = i + 1; j < eventos.length; j++) {
                    if (eventos[i].dataVerificada.getTotalSeconds() == eventos[j].dataVerificada.getTotalSeconds()) {
                        throw new Error('Não podem existir dois ou mais eventos com a mesma Data/Hora Verificada e mesmo Estágio de Operação' +
                            ' (comissionamento ou operação comercial), exceto no caso de evento de Mudança de Estado Operativo com' +
                            ' Estado Operativo “EOC”.');
                    }
                }
            }
        }
    }

    /**
     * RNR081 - Restrição para dois eventos consecutivos de mudança de estado operativo.
     * @param {EventoMudancaEstadoOperativo[]} eventos 
     */
    verificarEventosConsecutivos(eventos) {
        for (let i = 0; i < eventos.length; i++) {
            if (!this.isEventoEspelho(eventos[i - 1], eventos[i]) && this.compararEventosConsecutivos(eventos[i - 1], eventos[i])) {
                throw new Error('Não pode haver dois ou mais eventos consecutivos de Mudança de Estado Operativo' +
                    ' com os mesmos valores de Estado Operativo, Condição Operativa, Origem e Disponibilidade, exceto no caso do evento espelho.');
            }
        }
    }

    compararEventosConsecutivos(eventoAnterior, evento) {
        return eventoAnterior != undefined &&
            eventoAnterior.idEstadoOperativo == evento.idEstadoOperativo &&
            eventoAnterior.idCondicaoOperativa == evento.idCondicaoOperativa &&
            eventoAnterior.idClassificacaoOrigem == evento.idClassificacaoOrigem &&
            eventoAnterior.potenciaDisponivel == evento.potenciaDisponivel
    }

}

module.exports = EventoMudancaEstadoOperativoBusiness;