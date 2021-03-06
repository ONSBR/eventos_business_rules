const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {

    const MSG_ERRO = 'Não pode haver dois ou mais eventos consecutivos de Mudança de Estado Operativo com os mesmos valores de Estado Operativo, Condição Operativa, Origem e Disponibilidade, exceto no caso do evento espelho.Eventos 3 e 4';
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Restringir dois ou mais eventos consecutivos de Mudança de Estado Operativo com os mesmos valores de Estado Operativo,' +
        ' Condição Operativa, Origem e Disponibilidade, exceto no caso do evento espelho.Eventos 3 e 4', () => {
            let eventosConsecutivosSemelhantes = [
                {idEvento: '1', idEstadoOperativo: 'EOC', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300, dataVerificada: new Date(2018, 1, 1, 0, 0) },
                {idEvento: '2', idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300, dataVerificada: new Date(2018, 1, 1, 0, 0) },
                {idEvento: '3', idEstadoOperativo: 'DCO', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300, dataVerificada: new Date(2018, 1, 2, 3, 0) },
                {idEvento: '4', idEstadoOperativo: 'DCO', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300, dataVerificada: new Date(2018, 1, 2, 3, 0) }];

            expect(() => {
                eventoMudancaEstadoOperativoBusiness.verificarEventosConsecutivos(eventosConsecutivosSemelhantes);
            }).toThrowError(MSG_ERRO);

            let semEventosConsecutivosSemelhantes = [
                { idEstadoOperativo: 'EOC', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300, dataVerificada: new Date(2018, 1, 1, 0, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300, dataVerificada: new Date(2018, 1, 1, 0, 0) },
                { idEstadoOperativo: 'DCO', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300, dataVerificada: new Date(2018, 1, 2, 3, 0) },
                { idEstadoOperativo: 'LIG', idCondicaoOperativa: 'RFO', idClassificacaoOrigem: 'GOT', potenciaDisponivel: 300, dataVerificada: new Date(2018, 1, 2, 3, 0) }];
            eventoMudancaEstadoOperativoBusiness.verificarEventosConsecutivos(semEventosConsecutivosSemelhantes);

        });
});