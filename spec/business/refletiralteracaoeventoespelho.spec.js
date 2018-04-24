const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Refletir ultima alteração do mês em evento espelho:', () => {
        let eventos = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31), operacao: 'A' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 2, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 3, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 4, 1, 9, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 700, dataVerificada: new Date(2017, 4, 15, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        let eventosAlterados = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31), operacao: 'A' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 1, 1, 0, 0), operacao: 'AA'  },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 2, 1, 0, 0), operacao: 'AA'  },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 3, 1, 0, 0), operacao: 'AA'  },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 4, 1, 9, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 700, dataVerificada: new Date(2017, 4, 15, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        eventoMudancaEstadoOperativoBusiness.refletirAlteracaoDeUltimoEventoEmEventoespelho(eventos);
        expect(eventos).toEqual(eventosAlterados);
    });

    it('Refletir ultima alteração do mês em eventos espelhos(2):', () => {
        let eventos = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31), operacao: 'A' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 2, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 3, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 4, 1, 9, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 700, dataVerificada: new Date(2017, 4, 15, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        let eventosAlterados = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31), operacao: 'A' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 1, 1, 0, 0), operacao: 'AA' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 2, 1, 0, 0), operacao: 'AA' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 3, 1, 0, 0), operacao: 'AA' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 4, 1, 9, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 700, dataVerificada: new Date(2017, 4, 15, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        eventoMudancaEstadoOperativoBusiness.refletirAlteracaoDeUltimoEventoEmEventoespelho(eventos);
        expect(eventos).toEqual(eventosAlterados);
    });

    it('Não deve refletir alteração quando não for último evento do mês:', () => {
        let eventos = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 30), operacao: 'A' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 2, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        let eventosAlterados = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 30), operacao: 'A' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 2, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        eventoMudancaEstadoOperativoBusiness.refletirAlteracaoDeUltimoEventoEmEventoespelho(eventos);
        expect(eventos).toEqual(eventosAlterados);
    });

});



