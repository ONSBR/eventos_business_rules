const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Restringir mudança de estado operativo sem valor ou com valor negativo:', () => {

        let eventos = [{ potenciaDisponivel: 500 }, { potenciaDisponivel: 300 }];
        let unidadeGeradora = { potenciaDisponivel: 500 };
        eventoMudancaEstadoOperativoBusiness.verificarPotenciaNegativaOuSuperiorPotencia(unidadeGeradora, eventos);

        let eventosComPotenciaDisponivelNegativa = [{ potenciaDisponivel: -500 }, { potenciaDisponivel: 300 }];
        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarPotenciaNegativaOuSuperiorPotencia({}, eventosComPotenciaDisponivelNegativa);
            }
        ).toThrowError('Valor disponibilidade não pode ser negativo.');

        let eventosComPotenciaDisponivelAcimaDaUnidadeGeradora = [{ potenciaDisponivel: 600 }];
        expect(
            function() {
                eventoMudancaEstadoOperativoBusiness.verificarPotenciaNegativaOuSuperiorPotencia(unidadeGeradora, eventosComPotenciaDisponivelAcimaDaUnidadeGeradora);
            }
        ).toThrowError('Valor disponibilidade superior a da unidade geradora.');

    });
});