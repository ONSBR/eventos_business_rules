const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Valor de horas limite para utilização da franquia GIM. Não pode haver registro de evento com Origem “GIM” antes do' +
        ' Equipamento completar 120 meses de entrada em operação comercial. Regra Válida após 01/10/14.', () => {

            let eventosAntes01102014 = [
                { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2000, 7, 15) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2000, 11, 31) }
            ];
            expect(eventoMudancaEstadoOperativoBusiness.verificarRestricaoTempoUtilizacaoFranquiaGIM(eventosAntes01102014)).toBeUndefined();

            let eventosApos01102014ComEventoGIMAntes120Meses = [
                { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2015, 11, 31) }
            ];
            expect(
                function () {
                    eventoMudancaEstadoOperativoBusiness.verificarRestricaoTempoUtilizacaoFranquiaGIM(eventosApos01102014ComEventoGIMAntes120Meses)
                }
            ).toThrowError('Não pode haver registro de evento com Origem “GIM” antes do Equipamento completar 120 meses de entrada em operação comercial.');

            let eventosApos01102014ComEventoGIMDepois120Meses = [
                { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1, 0, 0, 0) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2024, 10, 2, 0, 0, 0) }
            ];
            expect(eventoMudancaEstadoOperativoBusiness.verificarRestricaoTempoUtilizacaoFranquiaGIM(eventosApos01102014ComEventoGIMDepois120Meses)).toBeUndefined();
        });

    it('Não pode haver registro de evento com Origem “GIM” que ultrapasse o limite de 12 meses,'
        + 'contados a partir de 120 meses da data de entrada em operação comercial', () => {

            let eventosQueExcedem12Meses = [
                { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1, 0, 0, 0) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2024, 10, 2, 0, 0, 0) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2025, 10, 3, 0, 0, 0) }
            ];
            expect(
                function () {
                    eventoMudancaEstadoOperativoBusiness.verificarRestricaoTempoUtilizacaoFranquiaGIM(eventosQueExcedem12Meses);
                }
            ).toThrowError('Não pode haver registro de evento com Origem “GIM” que ultrapasse o limite de 12 meses, contados a partir de 120 meses da data de entrada em operação comercial.');

            let eventosQueNaoExcedem12Meses = [
                { idEstadoOperativo: 'EOC', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GUM', potenciaDisponivel: 500, dataVerificada: new Date(2014, 10, 1, 0, 0, 0) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2024, 10, 2, 0, 0, 0) },
                { idEstadoOperativo: 'LIG', idClassificacaoOrigem: 'GIM', potenciaDisponivel: 500, dataVerificada: new Date(2024, 10, 4, 0, 0, 0) }
            ];

            eventoMudancaEstadoOperativoBusiness.verificarRestricaoTempoUtilizacaoFranquiaGIM(eventosQueNaoExcedem12Meses);
        });

});