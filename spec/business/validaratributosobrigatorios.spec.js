const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Restringir mudança de estado operativo sem valor ou com valor negativo:', () => {
        let eventosComPotenciaDisponivelVazia = [{ operacao: 'A', dataVerificada: new Date() }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarAtributosObrigatorios(eventosComPotenciaDisponivelVazia);
            }
        ).toThrowError('Valor disponibilidade deve ser preenchido.');

        let eventosComDataVazia = [{ operacao: 'A', potenciaDisponivel: 500 }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarAtributosObrigatorios(eventosComDataVazia);
            }
        ).toThrowError('Data deve ser preenchida.');

        let eventosSemEstadoOperativo = [{ operacao: 'A', potenciaDisponivel: 500, dataVerificada: new Date() }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarAtributosObrigatorios(eventosSemEstadoOperativo);
            }
        ).toThrowError('Estado operativo deve ser preenchido.');

        let eventosComCamposObrigatorios = [{
            operacao: 'A', potenciaDisponivel: 500, dataVerificada: new Date(),
            idEstadoOperativo: 'LIG'
        }];
        eventoMudancaEstadoOperativoBusiness.verificarAtributosObrigatorios(eventosComCamposObrigatorios);
    });
});