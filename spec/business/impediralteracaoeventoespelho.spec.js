const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Impedir a alterações diretas de eventos espelhos', () => {

        let eventosComAlteracoes = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1, 0, 0, 0) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 11, 2, 0, 0, 0) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 400, dataVerificada: new Date(2014, 11, 3, 0, 0, 0), operacao: 'A' }
        ];
        eventoMudancaEstadoOperativoBusiness.validarAlteracoesDiretasEventosEspelhos(eventosComAlteracoes);

        eventosComAlteracoes = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1) }
        ];
        eventoMudancaEstadoOperativoBusiness.validarAlteracoesDiretasEventosEspelhos(eventosComAlteracoes);

        let eventosComAlteracoesEmEventosEspelhos = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1, 0, 0, 0) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 11, 2, 0, 0, 0) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 400, dataVerificada: new Date(2015, 0, 1, 0, 0, 0), operacao: 'A' }
        ];
        expect(
            function() {
                eventoMudancaEstadoOperativoBusiness.validarAlteracoesDiretasEventosEspelhos(eventosComAlteracoesEmEventosEspelhos);
            }
        ).toThrowError('Não são permitidas ao ator COSR retificações/revisões diretamente em eventos-espelho (evento zero-hora).');
    });

});