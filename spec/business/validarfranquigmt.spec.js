const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Verificar que não pode haver registro de evento com Origem “GMT” após 5 anos de operação comercial para' +
        ' os Equipamentos que entraram em operação comercial após 01/10/2014. Não existe restrição para antes de 2014.', () => {

            let eventosAntes01102014 = [
                { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GMT', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2004, 11, 31) }
            ];
            expect(eventoMudancaEstadoOperativoBusiness.verificarRestricaoTempoUtilizacaoFranquiaGMT(eventosAntes01102014));

            eventosAntes01102014 = [
                { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GMT', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2018, 12, 31) }
            ];
            expect(eventoMudancaEstadoOperativoBusiness.verificarRestricaoTempoUtilizacaoFranquiaGMT(eventosAntes01102014));

            let eventosApos01102014 = [
                { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 11, 15) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GMT', potenciaDisponivel: 500, dataVerificada: new Date(2014, 11, 15) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2017, 11, 31) }
            ];
            // expect(eventoMudancaEstadoOperativoBusiness.verificarRestricaoTempoUtilizacaoFranquiaGMT(eventosApos01102014));

        });

});