const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {

    const MSG_ERRO = 'Um evento de Mudança de Estado Operativo com Estado Operativo de Desligamento, exceto “DCO”,' +
    ' tem que ter: Condição Operativa em branco, Valor de Disponibilidade igual a zero e Origem preenchida.';

    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Validar que Um evento de Mudança de Estado Operativo com Estado Operativo de Desligamento, exceto “DCO”,' +
        ' tem que ter: Condição Operativa em branco, Valor de Disponibilidade igual a zero e Origem preenchida.', () => {

            let eventosDEMComCondicaoOperativa = [{idEstadoOperativo: 'DEM', idCondicaoOperativa: 'NOR'}];
            expect(
                () => {
                    eventoMudancaEstadoOperativoBusiness.verificarEstadoOperativoDesligamento(eventosDEMComCondicaoOperativa);
                }
            ).toThrowError(MSG_ERRO);

            let eventosDEMComValorDisponibilidadeDiferenteZero = [{idEstadoOperativo: 'DEM', potenciaDisponivel: 1}];
            expect(
                () => {
                    eventoMudancaEstadoOperativoBusiness.verificarEstadoOperativoDesligamento(eventosDEMComValorDisponibilidadeDiferenteZero);
                }
            ).toThrowError(MSG_ERRO);

            let eventosDEMSemOrigemPreenchida = [{idEstadoOperativo: 'DEM', potenciaDisponivel: 0, idCondicaoOperativa: ''}];
            expect(
                () => {
                    eventoMudancaEstadoOperativoBusiness.verificarEstadoOperativoDesligamento(eventosDEMSemOrigemPreenchida);
                }
            ).toThrowError(MSG_ERRO);

            let eventosDEMComCamposObrigatoriosPreenchidos = [{idEstadoOperativo: 'DEM', potenciaDisponivel: 0, 
                idCondicaoOperativa: '', idClassificacaoOrigem: 'GUM'}];
            eventoMudancaEstadoOperativoBusiness.verificarEstadoOperativoDesligamento(eventosDEMComCamposObrigatoriosPreenchidos);

            let eventosDCO = [{idEstadoOperativo: 'DCO', idCondicaoOperativa: 'NOR'}];
            eventoMudancaEstadoOperativoBusiness.verificarEstadoOperativoDesligamento(eventosDCO);
        });

});