const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    const MSG_ERRO = 'Um evento de Mudança de Estado Operativo com Estado Operativo “DCO” posterior' +
        ' a um evento com Estado Operativo “LIG” e Condição Operativa “RFO” ou “RPR” deve ter a mesma Condição Operativa,' +
        ' origem e valor de Disponibilidade do evento predecessor, exceto se for Origem “GRE”';
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Permitir Evento DCO Apos Lig:', () => {
        let listaComUmEvento = [{ id: '1' }];
        eventoMudancaEstadoOperativoBusiness.verificarEventoDCOAposLig(listaComUmEvento);

        let eventosRFO = [{ idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300 },
        { idEstadoOperativo: 'DCO', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300 },
        { idEstadoOperativo: 'LIG', potenciaDisponivel: 300, idCondicaoOperativa: 'RFO' }];
        eventoMudancaEstadoOperativoBusiness.verificarEventoDCOAposLig(eventosRFO);

        let eventosRPR = [{ idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300 },
        { idEstadoOperativo: 'DCO', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300 },
        { idEstadoOperativo: 'LIG', potenciaDisponivel: 300, idCondicaoOperativa: 'RPR' }];
        eventoMudancaEstadoOperativoBusiness.verificarEventoDCOAposLig(eventosRPR);

        let eventosLIG = [{ idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300 },
        { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300 },
        { idEstadoOperativo: 'LIG', potenciaDisponivel: 300, idCondicaoOperativa: 'RPR' }];
        eventoMudancaEstadoOperativoBusiness.verificarEventoDCOAposLig(eventosLIG);
    });

    it('Restringir evento DCO e condição RFO Apos Lig com condição operativa, origem ou potência diferentes do predecessor:', () => {

        let eventosRFOComPotenciaDiferente = [
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 400 },
            { idEstadoOperativo: 'DCO', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300 },
            { idEstadoOperativo: 'LIG', potenciaDisponivel: 300, idCondicaoOperativa: 'RFO' }];

        expect(() => {
            eventoMudancaEstadoOperativoBusiness.verificarEventoDCOAposLig(eventosRFOComPotenciaDiferente);
        }).toThrowError(MSG_ERRO);

        let eventosRFOComOrigemDiferente = [
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 400 },
            { idEstadoOperativo: 'DCO', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400 },
            { idEstadoOperativo: 'LIG', potenciaDisponivel: 300, idCondicaoOperativa: 'RFO' }];
        expect(() => {
            eventoMudancaEstadoOperativoBusiness.verificarEventoDCOAposLig(eventosRFOComOrigemDiferente);
        }).toThrowError(MSG_ERRO);

        let eventosRFOComCondicaoOperativaDiferente = [
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 400 },
            { idEstadoOperativo: 'DCO', idCondicaoOperativa: 'NOR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400 },
            { idEstadoOperativo: 'LIG', potenciaDisponivel: 300, idCondicaoOperativa: 'RFO' }];
        expect(() => {
            eventoMudancaEstadoOperativoBusiness.verificarEventoDCOAposLig(eventosRFOComCondicaoOperativaDiferente);
        }).toThrowError(MSG_ERRO);
    });

    it('Restringir evento DCO e condição RPR Apos Lig com condição operativa, origem ou potência diferentes do predecessor:', () => {

        let eventosRPRComPotenciaDiferente = [
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 400 },
            { idEstadoOperativo: 'DCO', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300 },
            { idEstadoOperativo: 'LIG', potenciaDisponivel: 300, idCondicaoOperativa: 'RFO' }];

        expect(() => {
            eventoMudancaEstadoOperativoBusiness.verificarEventoDCOAposLig(eventosRPRComPotenciaDiferente);
        }).toThrowError(MSG_ERRO);

        let eventosRPRComOrigemDiferente = [
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 400 },
            { idEstadoOperativo: 'DCO', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400 },
            { idEstadoOperativo: 'LIG', potenciaDisponivel: 300, idCondicaoOperativa: 'RFO' }];
        expect(() => {
            eventoMudancaEstadoOperativoBusiness.verificarEventoDCOAposLig(eventosRPRComOrigemDiferente);
        }).toThrowError(MSG_ERRO);

        let eventosRPRComCondicaoOperativaDiferente = [
            { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RPR', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 400 },
            { idEstadoOperativo: 'DCO', idCondicaoOperativa: 'NOR', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 400 },
            { idEstadoOperativo: 'LIG', potenciaDisponivel: 300, idCondicaoOperativa: 'RFO' }];
        expect(() => {
            eventoMudancaEstadoOperativoBusiness.verificarEventoDCOAposLig(eventosRPRComCondicaoOperativaDiferente);
        }).toThrowError(MSG_ERRO);
    });
});