const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();


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

        let eventoExclusaoComDisponibilidadePreenchida = 
            { idCondicaoOperativa: 'TST', potenciaDisponivel: 500, idEstadoOperativo: 'LIG', operacao: 'E' };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoExclusaoComDisponibilidadePreenchida, uge);
        expect(eventoExclusaoComDisponibilidadePreenchida.potenciaDisponivel).toEqual(500);
    });

    it('Preencher o campo disponibilidade com zero quando o estado operativo for desligado exceto DCO:', () => {
        let uge = { potenciaDisponivel: 250 };

        let eventoDEM = { idEstadoOperativo: 'DEM', potenciaDisponivel: undefined };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoDEM, uge);
        expect(eventoDEM.potenciaDisponivel).toEqual(0);

        let eventoDCA = { idEstadoOperativo: 'DCA', potenciaDisponivel: undefined };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoDCA, uge);
        expect(eventoDCA.potenciaDisponivel).toEqual(0);

        let eventoDES = { idEstadoOperativo: 'DES', potenciaDisponivel: undefined };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoDES, uge);
        expect(eventoDES.potenciaDisponivel).toEqual(0);

        let eventoDESInclusao = { idEstadoOperativo: 'DES', potenciaDisponivel: undefined, operacao: 'I' };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoDESInclusao, uge);
        expect(eventoDESInclusao.potenciaDisponivel).toEqual(0);
        expect(eventoDESInclusao.operacao).toEqual('I');

        let eventoDESSemOperacao = { idEstadoOperativo: 'DES', potenciaDisponivel: undefined };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoDESSemOperacao, uge);
        expect(eventoDESSemOperacao.potenciaDisponivel).toEqual(0);
        expect(eventoDESSemOperacao.operacao).toEqual('A');

        let eventoDESExclusao = { idEstadoOperativo: 'DES', operacao: 'E' };
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoDESExclusao, uge);
        expect(eventoDESExclusao.potenciaDisponivel).toBeUndefined();

        let eventoDCO = { idEstadoOperativo: 'DCO'};
        eventoMudancaEstadoOperativoBusiness.preencherCampoDisponibilidadeVazio(eventoDCO, uge);
        expect(eventoDESExclusao.potenciaDisponivel).toBeUndefined();
    });

});