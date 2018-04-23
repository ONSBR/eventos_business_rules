const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    const MSG_ERRO = 'Não pode haver evento de Mudança de Estado Operativo sem a Condição Operativa preenchida quando'
        + ' o estado operativo for igual a “LIG”, “LCS”, “LCC”, “LCI”, “DCO” ou “RDP”.'
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Restringir evento de mudança de estado operativo sem condição operativa.', () => {

        let eventosLIGSemCondicaoOperativa = [{ idEstadoOperativo: 'LIG', idCondicaoOperativa: '' }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperativa(eventosLIGSemCondicaoOperativa);
            }
        ).toThrowError(MSG_ERRO);

        eventosLIGSemCondicaoOperativa = [{ idEstadoOperativo: 'LIG'}];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperativa(eventosLIGSemCondicaoOperativa);
            }
        ).toThrowError(MSG_ERRO);

        eventosLCSSemCondicaoOperativa = [{ idEstadoOperativo: 'LCS'}];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperativa(eventosLCSSemCondicaoOperativa);
            }
        ).toThrowError(MSG_ERRO);

        eventosLCCSemCondicaoOperativa = [{ idEstadoOperativo: 'LCC'}];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperativa(eventosLCCSemCondicaoOperativa);
            }
        ).toThrowError(MSG_ERRO);

        eventosLCISemCondicaoOperativa = [{ idEstadoOperativo: 'LCI'}];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperativa(eventosLCISemCondicaoOperativa);
            }
        ).toThrowError(MSG_ERRO);

        eventosDCOSemCondicaoOperativa = [{ idEstadoOperativo: 'DCO'}];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperativa(eventosDCOSemCondicaoOperativa);
            }
        ).toThrowError(MSG_ERRO);

        eventosRDPSemCondicaoOperativa = [{ idEstadoOperativo: 'RDP'}];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperativa(eventosRDPSemCondicaoOperativa);
            }
        ).toThrowError(MSG_ERRO);

        eventosDEMSemCondicaoOperativa = [{ idEstadoOperativo: 'DEM', idClassificacaoOrigem: 'GUM'}];
        eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperativa(eventosDEMSemCondicaoOperativa);
    });

    it('Permitir evento de mudança de estado operativo com condição operativa preenchida.', () => {
        let eventosLig = [{ idEstadoOperativo: 'LIG', idCondicaoOperativa: 'NOR' }];
        eventoMudancaEstadoOperativoBusiness.verificarCondicaoOperativa(eventosLig);
    });
});