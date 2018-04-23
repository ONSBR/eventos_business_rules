const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    const MSG_ERRO = 'Não pode haver evento de Mudança de Estado Operativo com Condição Operativa RPR ou RFO e sem' +
        ' valor de Disponibilidade, Origem';
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Restringir evento estado operativo com condição operativa RPR ou RFO e sem valor de disponibilidade e origem.', () => {

        let eventosRPRSemValorDisponibilidade = [{ idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM' }];
        expect(
            () => {
                eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperacaoOperativaRPROuRFO(eventosRPRSemValorDisponibilidade);
            }
        ).toThrowError(MSG_ERRO);

        let eventosRFOSemValorDisponibilidade = [{ idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GUM' }];
        expect(
            () => {
                eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperacaoOperativaRPROuRFO(eventosRPRSemValorDisponibilidade);
            }
        ).toThrowError(MSG_ERRO);

        let eventosRFOSemOrigem = [{ idCondicaoOperativa: 'RFO', potenciaDisponivel: 500 }];
        expect(
            () => {
                eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperacaoOperativaRPROuRFO(eventosRPRSemValorDisponibilidade);
            }
        ).toThrowError(MSG_ERRO);

        let eventosRFOComCamposPreenchidos = [{ idCondicaoOperativa: 'RFO', potenciaDisponivel: 500, idClassificacaoOrigem: 'GUM'}];;
        eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperacaoOperativaRPROuRFO(eventosRFOComCamposPreenchidos);

        let eventosNOTSemValorDisponibilidadeEOrigem = [{ idCondicaoOperativa: 'NOT' }];
        eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperacaoOperativaRPROuRFO(eventosNOTSemValorDisponibilidadeEOrigem);
    });

});