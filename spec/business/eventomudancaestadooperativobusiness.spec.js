const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Validar a existência de um evento de Entrada Em Operação comercial(EOC):', () => {
        let eventosComUmEOC = [{ idEstadoOperativo: 'EOC', dataVerificadaEmSegundos: 100 },
        { idEstadoOperativo: 'LIG', dataVerificadaEmSegundos: 100 },
        { idEstadoOperativo: 'LIG', dataVerificadaEmSegundos: 200 },
        { idEstadoOperativo: 'LCC', dataVerificadaEmSegundos: 300 }];
        eventoMudancaEstadoOperativoBusiness.verificarUnicidadeEventoEntradaOperacaoComercial(eventosComUmEOC);

        let eventosComUmEOC2 = [{ idEstadoOperativo: 'DCA', dataVerificadaEmSegundos: 100 },
        { idEstadoOperativo: 'EOC', dataVerificadaEmSegundos: 200 },
        { idEstadoOperativo: 'LIG', dataVerificadaEmSegundos: 200 },
        { idEstadoOperativo: 'LCC', dataVerificadaEmSegundos: 300 }];
        eventoMudancaEstadoOperativoBusiness.verificarUnicidadeEventoEntradaOperacaoComercial(eventosComUmEOC2);

        let eventosComDoisEOC = [{ idEstadoOperativo: 'DCA', dataVerificadaEmSegundos: 100 },
        { idEstadoOperativo: 'EOC', dataVerificadaEmSegundos: 200 },
        { idEstadoOperativo: 'EOC', dataVerificadaEmSegundos: 200 },
        { idEstadoOperativo: 'LCC', dataVerificadaEmSegundos: 300 }];

        expect(
            () => {
                eventoMudancaEstadoOperativoBusiness.verificarUnicidadeEventoEntradaOperacaoComercial(eventosComDoisEOC);
            }
        ).toThrowError('É obrigatória a existência de um, e somente um, evento com o estado operativo EOC.');

        let eventosComUmEOCESemEventoSimultaneo = [{ idEstadoOperativo: 'DCA', dataVerificadaEmSegundos: 100 },
        { idEstadoOperativo: 'EOC', dataVerificadaEmSegundos: 200 },
        { idEstadoOperativo: 'LIG', dataVerificadaEmSegundos: 300 },
        { idEstadoOperativo: 'LCC', dataVerificadaEmSegundos: 400 }];
        expect(
            () => {
                eventoMudancaEstadoOperativoBusiness.verificarUnicidadeEventoEntradaOperacaoComercial(eventosComUmEOCESemEventoSimultaneo);
            }
        ).toThrowError('Deve existir um evento com a mesma data/hora do evento EOC.');
    });

    it('Preencher o campo disponibilidade com a potência vigente quando a condição operativa for NOR, NOT ou TST:', () => {
        let uge = { potenciaDisponivel: 250 };

        let eventoNOR = { idCondicaoOperativa: 'NOR', potenciaDisponivel: undefined, idEstadoOperativo: 'LIG' };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoNOR, uge);
        expect(eventoNOR.potenciaDisponivel).toEqual(uge.potenciaDisponivel);

        let eventoNOT = { idCondicaoOperativa: 'NOT', potenciaDisponivel: undefined, idEstadoOperativo: 'LIG' };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoNOT, uge);
        expect(eventoNOT.potenciaDisponivel).toEqual(uge.potenciaDisponivel);

        let eventoTST = { idCondicaoOperativa: 'TST', potenciaDisponivel: undefined, idEstadoOperativo: 'LIG' };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoTST, uge);
        expect(eventoTST.potenciaDisponivel).toEqual(uge.potenciaDisponivel);

        let eventoComDisponibilidadePreenchida = { idCondicaoOperativa: 'TST', potenciaDisponivel: 500, idEstadoOperativo: 'LIG' };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoComDisponibilidadePreenchida, uge);
        expect(eventoComDisponibilidadePreenchida.potenciaDisponivel).toEqual(500);
    });

    it('Preencher o campo disponibilidade com zero quando o estado operativo for desligado exceto DCO:', () => {
        let uge = { potenciaDisponivel: 250 };

        let eventoDEM = { idEstadoOperativo: 'DEM', potenciaDisponivel: undefined };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoDEM, uge);
        expect(eventoDEM.potenciaDisponivel).toEqual(0);

        let eventoDCA = { idEstadoOperativo: 'DCA', potenciaDisponivel: undefined };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoDCA, uge);
        expect(eventoDCA.potenciaDisponivel).toEqual(0);

        let eventoTST = { idEstadoOperativo: 'DES', potenciaDisponivel: undefined };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoTST, uge);
        expect(eventoTST.potenciaDisponivel).toEqual(0);

        let eventoDCO = { idEstadoOperativo: 'DCO', potenciaDisponivel: undefined };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoDCO, uge);
        expect(eventoDCO.potenciaDisponivel).toBe(uge.potenciaDisponivel);
    });

    it('Refletir ultima alteração do mês em evento espelho:', () => {
        let eventos = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31), operacao: 'A' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 2, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 3, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 4, 1, 9, 0), operacao: 'I' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 700, dataVerificada: new Date(2017, 4, 15, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        let eventosAlterados = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31), operacao: 'A' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 1, 1, 0, 0) },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 2, 1, 0, 0) },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 3, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 4, 1, 9, 0), operacao: 'I' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 700, dataVerificada: new Date(2017, 4, 15, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        eventoMudancaEstadoOperativoBusiness.refletirAlteracaoDeUltimoEventoEmEventoespelho(eventos);
        expect(eventos).toEqual(eventosAlterados);
    });

    it('Refletir ultima alteração do mês em eventos espelhos:', () => {
        let eventos = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31), operacao: 'A' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 1, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 2, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 3, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 4, 1, 9, 0), operacao: 'I' },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 700, dataVerificada: new Date(2017, 4, 15, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2017, 5, 1, 9, 15), operacao: 'A' }];

        let eventosAlterados = [
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 0, 31), operacao: 'A' },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 1, 1, 0, 0) },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 2, 1, 0, 0) },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400, dataVerificada: new Date(2017, 3, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 300, dataVerificada: new Date(2017, 4, 1, 9, 0), operacao: 'I' },
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
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 1, 1, 0, 0) },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 2, 1, 0, 0) },
            { idEstadoOperativo: 'DUR', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 3, 1, 0, 0) },
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

    it('Verificar Tempo limite para utilização da  franquia GIC: Regra válida após 10/2014. Tempo limite para utilização da' +
        'franquia GIC: Regra válida após 10/2014', () => {

            let eventos = [
                { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 9, 1) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2014, 9, 1) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2014, 9, 2) }
            ];

            expect(eventoMudancaEstadoOperativoBusiness.verificarTempoLimiteFranquiaGIC(eventos)).toBeUndefined();

            let eventosComGICApos24Meses = [
                { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2015, 0, 1) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2015, 0, 1) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2017, 1, 2) }
            ];

            expect(
                function () {
                    eventoMudancaEstadoOperativoBusiness.verificarTempoLimiteFranquiaGIC(eventosComGICApos24Meses);
                }
            ).toThrowError('Evento GIC após 24 meses do EOC.');
        });

    it('Verificar Tempo limite para utilização da  franquia GIC: Regra válida após 10/2014', () => {

        let eventos = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 9, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2014, 9, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2014, 9, 2) }
        ];

        expect(eventoMudancaEstadoOperativoBusiness.verificarTempoLimiteFranquiaGIC(eventos)).toBeUndefined();

        let eventosComGICApos24Meses = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2015, 0, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2015, 0, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2017, 1, 2) }
        ];


        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarTempoLimiteFranquiaGIC(eventosComGICApos24Meses);
            }
        ).toThrowError('Evento GIC após 24 meses do EOC.');
    });

    it('Verificar Tempo limite para utilização da  franquia GIC: Regra válida antes 10/2014.', () => {

        let eventos = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 8, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2014, 8, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2014, 8, 2) }
        ];

        expect(eventoMudancaEstadoOperativoBusiness.verificarTempoLimiteFranquiaGIC(eventos)).toBeUndefined();

        let eventosComGICApos15000Horas = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2002, 0, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2002, 0, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2005, 8, 18, 2, 0, 1) }
        ];

        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarTempoLimiteFranquiaGIC(eventosComGICApos15000Horas)
            }
        ).toThrowError('Evento GIC após 15000 horas do EOC.');
    });

    it('Valor de horas limite para utilização da franquia GIC.', () => {
        let eventosAntes01012001 = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2000, 8, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2000, 11, 31) }
        ];
        expect(eventoMudancaEstadoOperativoBusiness.verificarLimite960HorasEventoGIC(eventosAntes01012001)).toBeUndefined();

        let eventosApos01012001UltrapassaLimite = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2001, 0, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2001, 11, 31) }
        ];

        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarLimite960HorasEventoGIC(eventosApos01012001UltrapassaLimite);
            }
        ).toThrowError('Não pode haver registro de evento com Origem “GIC” que ultrapasse o limite de 960 horas.');

        let eventosApos01012001NaoUltrapassaLimite = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2001, 0, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2001, 0, 1) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2001, 0, 15) }
        ];
        expect(eventoMudancaEstadoOperativoBusiness.verificarLimite960HorasEventoGIC(eventosApos01012001NaoUltrapassaLimite)).toBeUndefined();
    });

    it('Verificar valor de horas limite para utilização da franquia GIC com eventos GIC espelhos no intervalo.', () => {
        let eventosApos01012001SemUltrapassarLimiteComEventoGICEspelhos = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2001, 0, 31) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 300, dataVerificada: new Date(2001, 1, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2001, 2, 2) }
        ];
        eventoMudancaEstadoOperativoBusiness.verificarLimite960HorasEventoGIC(eventosApos01012001SemUltrapassarLimiteComEventoGICEspelhos);

        let eventosApos01012001UltrapassaLimiteComEventoGICEspelho = [
            { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2001, 0, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2001, 1, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2001, 2, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2001, 3, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIC', potenciaDisponivel: 500, dataVerificada: new Date(2001, 4, 1, 0, 0) },
            { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GGE', potenciaDisponivel: 500, dataVerificada: new Date(2001, 4, 31) }
        ];

        expect(
            function () {
                eventoMudancaEstadoOperativoBusiness.verificarLimite960HorasEventoGIC(eventosApos01012001UltrapassaLimiteComEventoGICEspelho);
            }
        ).toThrowError('Não pode haver registro de evento com Origem “GIC” que ultrapasse o limite de 960 horas.');
    });

});



