const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    const MSG_ERRO = 'Não pode haver evento de Mudança de Estado Operativo sem a Origem preenchida quando o estado ' +
        'operativo for igual a “DEM”, “DUR”, “DAU”, “DPR”, “DPA” ou “DCA”.';
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Restringir evento de mudança de estado operativo sem origem.', () => {

        let eventosDEMSemOrigem = [{ idEstadoOperativo: 'DEM', idClassificacaoOrigem: '' }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarClassificacaoOrigem(eventosDEMSemOrigem);
            }
        ).toThrowError(MSG_ERRO);

        eventosDEMSemOrigem = [{ idEstadoOperativo: 'DEM' }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarClassificacaoOrigem(eventosDEMSemOrigem);
            }
        ).toThrowError(MSG_ERRO);

        eventosDURSemOrigem = [{ idEstadoOperativo: 'DUR' }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarClassificacaoOrigem(eventosDURSemOrigem);
            }
        ).toThrowError(MSG_ERRO);

        eventosDAUSemOrigem = [{ idEstadoOperativo: 'DAU' }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarClassificacaoOrigem(eventosDAUSemOrigem);
            }
        ).toThrowError(MSG_ERRO);

        eventosDPRSemOrigem = [{ idEstadoOperativo: 'DPR' }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarClassificacaoOrigem(eventosDPRSemOrigem);
            }
        ).toThrowError(MSG_ERRO);

        eventosDPASemOrigem = [{ idEstadoOperativo: 'DPA' }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarClassificacaoOrigem(eventosDPASemOrigem);
            }
        ).toThrowError(MSG_ERRO);

        eventosDCASemOrigem = [{ idEstadoOperativo: 'DCA' }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarClassificacaoOrigem(eventosDCASemOrigem);
            }
        ).toThrowError(MSG_ERRO);

        eventosLIGSemOrigem = [{ idEstadoOperativo: 'LIG' }];
        eventoMudancaEstadoOperativoBusiness.verificarClassificacaoOrigem(eventosLIGSemOrigem);
    });

    it('Permitir evento de mudança de estado operativo com origem preenchida.', () => {
        let eventosDEMComOrigemPreenchida = [{ idEstadoOperativo: 'DEM', idClassificacaoOrigem: 'GUM' }];
        eventoMudancaEstadoOperativoBusiness.verificarClassificacaoOrigem(eventosDEMComOrigemPreenchida);
    });

});