const UtilCalculoParametro = require('./utilcalculoparametro');
const extensions = require("./extensions");
const ESTADOS_OPERATIVOS_DESLIGADO_EXCETO_DCO = ['DEM', 'DUR', 'DAU', 'DCA', 'DPR', 'DPA', 'DAP', 'DES', 'DOM'];

class EventoMudancaEstadoOperativoBusiness {

    /**
     * RNI080 - Entrada em Operação Comercial de um equipamento. 
     * É obrigatória a existência de um, e somente um, evento com o estado operativo EOC para 
     * indicar a entrada em operação comercial de um equipamento.
     * @param {EventoMudancaEstadoOperativo[]} eventos - array de eventos.
     */
    verificarUnicidadeEventoEntradaOperacaoComercial(eventos) {
        let countEventosEOC = 0;
        let tempoEmSegundosEOC;
        let encontrouEventoSimultaneoAoEOC = false;

        eventos.forEach(evento => {
            // FIXME constantes
            if (this.isEventoEOC(evento)) {
                countEventosEOC++;
                tempoEmSegundosEOC = evento.dataVerificadaEmSegundos;
            }

            if (!this.isEventoEOC(evento) && tempoEmSegundosEOC != undefined &&
                evento.dataVerificadaEmSegundos == tempoEmSegundosEOC) {
                encontrouEventoSimultaneoAoEOC = true;
            }
        });

        if (countEventosEOC != 1) {
            throw new Error('É obrigatória a existência de um, e somente um, evento com o estado operativo EOC.');
        }

        if (!encontrouEventoSimultaneoAoEOC) {
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
        if (!evento.potenciaDisponivel) {

            const NOR_NOT_TST = ['NOR', 'NOT', 'TST'];
            if (NOR_NOT_TST.includes(evento.idCondicaoOperativa)) {
                evento.potenciaDisponivel = uge.potenciaDisponivel;
            } else if (ESTADOS_OPERATIVOS_DESLIGADO_EXCETO_DCO.includes(evento.idEstadoOperativo)) {
                evento.potenciaDisponivel = 0;
            } else {
                evento.potenciaDisponivel = uge.potenciaDisponivel;
            }
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
            }
        }
    }

    isEventoEspelho(eventoAnterior, evento) {
        return eventoAnterior != undefined &&
            eventoAnterior.dataVerificada.getMonth() != evento.dataVerificada.getMonth() &&
            evento.dataVerificada.getDate() == 1 && evento.dataVerificada.getHours() == 0 && evento.dataVerificada.getMinutes() == 0;
    }

    isEventoAlteracao(evento) {
        return evento.operacao != undefined && evento.operacao == 'A';
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
        return evento.operacao != undefined && evento.operacao == 'E';
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
     *  RNI207 - Tempo limite para utilização da  franquia GIC: Regra válida após 10/2014
     *  Não pode haver registro de evento de Mudança de Estado Operativo com Origem “GIC” após 24 meses de operação comercial do Equipamento.
     *  Regra válida antes de 10/2014:
     *  Não pode haver registro de evento de Mudança de Estado Operativo com Origem “GIC” após 15000 horas de operação comercial do Equipamento (horas em serviço).
     * @param {EventoMudancaEstadoOperativo[]} eventos 
     */
    verificarTempoLimiteFranquiaGIC(eventos) {
        let dataVerificadaEOCApos24Meses;
        let dataVerificadaEOCApos15000;
        for (let i = 0; i < eventos.length; i++) {

            if (eventos[i].idEstadoOperativo == 'EOC' && dataVerificadaEOCApos24Meses == undefined && dataVerificadaEOCApos15000 == undefined) {
                dataVerificadaEOCApos24Meses = UtilCalculoParametro.adicionaMeses(eventos[i].dataVerificada, 24);
                dataVerificadaEOCApos15000 = UtilCalculoParametro.adicionaHoras(eventos[i].dataVerificada, 15000);
            }

            if (UtilCalculoParametro.gte_10_2014(eventos[i])) {
                if (this.isEventoGIC(eventos[i]) &&
                    eventos[i].dataVerificada.getTotalSeconds() > dataVerificadaEOCApos24Meses.getTotalSeconds()) {
                    throw new Error('Evento GIC após 24 meses do EOC.');
                }
            } else {
                if (this.isEventoGIC(eventos[i]) &&
                    eventos[i].dataVerificada.getTotalSeconds() > dataVerificadaEOCApos15000.getTotalSeconds()) {
                    throw new Error('Evento GIC após 15000 horas do EOC.');
                }
            }
        }
    }

    /**
     * RNI208 - Valor de horas limite para utilização da franquia GIC: Regra desde 01/01/2001
     * Não pode haver registro de evento com Origem “GIC” que ultrapasse o limite de 960 horas.
     * @param {EventoMudancaEstadoOperativo[]} eventos
     */
    verificarLimite960HorasEventoGIC(eventos, existeFechamentoParaOMes) {
        for (let i = 0; i < eventos.length; i++) {
            if (this.isEventoGIC(eventos[i]) && UtilCalculoParametro.gte_01_01_2001(eventos[i])) {
                for (let j = i + 1; j < eventos.length; j++) {
                    if (!this.isEventoEspelho(eventos[j - 1], eventos[j])) {
                        if (UtilCalculoParametro.calcularIntervaloEmHoras(eventos[i].dataVerificada, eventos[j].dataVerificada) > 960) {
                            throw new Error('Não pode haver registro de evento com Origem “GIC” que ultrapasse o limite de 960 horas.');
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }

    isEventoGIC(evento) {
        return evento.idClassificacaoOrigem == 'GIC';
    }

    /**
     * RNI216 - Não pode haver registro de evento com Origem “GIM” antes do Equipamento completar 120 meses de entrada em operação comercial.
     * Regra Válida após 01/10/14.
     * RNI217- Não pode haver registro de evento com Origem “GIM” que ultrapasse o limite de 12 meses, 
     * contados a partir de 120 meses da data de entrada em operação comercial
     * @param {EventoMudancaEstadoOperativo[]} eventos
     */
    verificarRestricaoTempoUtilizacaoFranquiaGIM(eventos) {
        let tempoEmSegundosEOC;
        for (let i = 0; i < eventos.length; i++) {

            if (UtilCalculoParametro.gte_10_2014(eventos[i])) {

                if (this.isEventoEOC(eventos[i])) {
                    tempoEmSegundosEOC = eventos[i].dataVerificada.getTotalSeconds();
                }
                if (this.isEventoGIM(eventos[i])) {
                    let tempoEmSegundosGIM = eventos[i].dataVerificada.getTotalSeconds();
                    UtilCalculoParametro.veficarTempoSuperior120Meses(tempoEmSegundosEOC, tempoEmSegundosGIM);

                    if (eventos[i + 1] != undefined) {
                        let tempoEmSegundosProximoEvento = eventos[i + 1].dataVerificada.getTotalSeconds();
                        UtilCalculoParametro.veficarTempoInferior12Meses(tempoEmSegundosGIM, tempoEmSegundosProximoEvento);
                    }

                }

            }

        }
    }

    isEventoGIM(evento) {
        return evento.idClassificacaoOrigem == 'GIM';
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
                    if (eventos[i].dataVerificadaEmSegundos == eventos[j].dataVerificadaEmSegundos) {
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