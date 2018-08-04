const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Validar a existência de um evento de Entrada Em Operação comercial(EOC):', () => {

        let dataJaneiro = new Date(2018, 0 , 1);
        let dataFevereiro = new Date(2018, 1 , 1);
        let dataMarco = new Date(2018, 2 , 1);
        let dataAbril = new Date(2018, 3 , 1);

        let eventosComUmEOC = [{ idEstadoOperativo: 'EOC', dataVerificada: dataJaneiro },
            { idEstadoOperativo: 'LIG', dataVerificada: dataJaneiro },
            { idEstadoOperativo: 'LIG', dataVerificada: dataFevereiro },
            { idEstadoOperativo: 'LCC', dataVerificada: dataMarco }];
        eventoMudancaEstadoOperativoBusiness.verificarUnicidadeEventoEntradaOperacaoComercial(eventosComUmEOC);

        let eventosComUmEOC2 = [{ idEstadoOperativo: 'DCA', dataVerificada: dataJaneiro },
            { idEstadoOperativo: 'EOC', dataVerificada: dataFevereiro },
            { idEstadoOperativo: 'LIG', dataVerificada: dataFevereiro },
            { idEstadoOperativo: 'LCC', dataVerificada: dataMarco }];
        eventoMudancaEstadoOperativoBusiness.verificarUnicidadeEventoEntradaOperacaoComercial(eventosComUmEOC2);

        let eventosComDoisEOC = [{ idEstadoOperativo: 'DCA', dataVerificada: dataJaneiro },
            { idEstadoOperativo: 'EOC', dataVerificada: dataFevereiro },
            { idEstadoOperativo: 'EOC', dataVerificada: dataFevereiro },
            { idEstadoOperativo: 'LCC', dataVerificada: dataMarco }];

        expect(
            () => {
                eventoMudancaEstadoOperativoBusiness.verificarUnicidadeEventoEntradaOperacaoComercial(eventosComDoisEOC);
            }
        ).toThrowError('É obrigatória a existência de um, e somente um, evento com o estado operativo EOC.');

        let eventosComUmEOCESemEventoSimultaneo = [{ idEstadoOperativo: 'DCA', dataVerificada: dataJaneiro },
        { idEstadoOperativo: 'EOC', dataVerificada: dataFevereiro },
        { idEstadoOperativo: 'LIG', dataVerificada: dataMarco },
        { idEstadoOperativo: 'LCC', dataVerificada: dataAbril }];
        expect(
            () => {
                eventoMudancaEstadoOperativoBusiness.verificarUnicidadeEventoEntradaOperacaoComercial(eventosComUmEOCESemEventoSimultaneo);
            }
        ).toThrowError('Deve existir um evento com a mesma data/hora do evento EOC.');
    });

    it('Quando o último evento do mês for excluído os eventos espelho passam a refletir o novo ultimo evento dos mês anterior:', () => {
        let eventos = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 0, 30) },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31), operacao: 'E' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 2, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 3, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 4, 1, 9, 0), operacao: 'I' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 700, dataVerificada: new Date(2017, 4, 15, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        let eventosAlterados = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 0, 30) },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31), operacao: 'E' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 1, 1, 0, 0), operacao: 'AA' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 2, 1, 0, 0), operacao: 'AA' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 3, 1, 0, 0), operacao: 'AA' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 4, 1, 9, 0), operacao: 'I' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 700, dataVerificada: new Date(2017, 4, 15, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        eventoMudancaEstadoOperativoBusiness.refletirAlteracoesQuandoUltimoEventoMesExcluido(eventos);
        expect(eventos).toEqual(eventosAlterados);
    });

    it('Quando um evento é excluído e ele não é o ultimo do mês nada deve ser refletido:', () => {
        let eventos = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 0, 30), operacao: 'E' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        let eventosAlterados = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 0, 30), operacao: 'E' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        eventoMudancaEstadoOperativoBusiness.refletirAlteracoesQuandoUltimoEventoMesExcluido(eventos);
        expect(eventos).toEqual(eventosAlterados);
    });

    it('Eventos consecutivos com mesmo estado operativo, condição operativa, origem e disponibilidade, exceto no caso do evento espelho, o primeiro evento deve ser preservado ' +
        'e os demais devem ser excluídos', () => {

            let eventos = [
                { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 0, 30) },
                { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 0, 31) },
                { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 0, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 1, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 2, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 3, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 2, 1, 0, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 400, dataVerificada: new Date(2017, 2, 1, 1, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 2, 30, 0, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 3, 2, 0, 0) }
            ];

            let eventosAlterados = [
                { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 0, 30) },
                { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 0, 31), operacao: 'E' },
                { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 0, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 1, 0), operacao: 'E' },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 2, 0), operacao: 'E' },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 3, 0), operacao: 'E' },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 2, 1, 0, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 400, dataVerificada: new Date(2017, 2, 1, 1, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 2, 30, 0, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 3, 2, 0, 0), operacao: 'E' }
            ];

            eventoMudancaEstadoOperativoBusiness.excluirEventosConsecutivosSemelhantes(eventos);
            expect(eventos).toEqual(eventosAlterados);
        });

});



