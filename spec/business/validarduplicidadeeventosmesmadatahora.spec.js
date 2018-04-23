const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Restringir eventos na mesma data hora com exceção do EOC:', () => {

        let eventosComUmEOC = [{ idEstadoOperativo: 'EOC', dataVerificadaEmSegundos: 100 },
        { idEstadoOperativo: 'LIG', dataVerificadaEmSegundos: 100 },
        { idEstadoOperativo: 'LCS', dataVerificadaEmSegundos: 200 },
        { idEstadoOperativo: 'LCC', dataVerificadaEmSegundos: 300}];
        eventoMudancaEstadoOperativoBusiness.verificarEventosNaMesmaDataHora(eventosComUmEOC);

        let eventosComEventosSimultaneos = [{ idEstadoOperativo: 'EOC', dataVerificadaEmSegundos: 100 },
        { idEstadoOperativo: 'LIG', dataVerificadaEmSegundos: 100 },
        { idEstadoOperativo: 'LCS', dataVerificadaEmSegundos: 100 },
        { idEstadoOperativo: 'LCC', dataVerificadaEmSegundos: 100 }];

        expect(
            () => {
                eventoMudancaEstadoOperativoBusiness.verificarEventosNaMesmaDataHora(eventosComEventosSimultaneos);
            }
        ).toThrowError('Não podem existir dois ou mais eventos com a mesma Data/Hora Verificada e mesmo Estágio de Operação' +
            ' (comissionamento ou operação comercial), exceto no caso de evento de Mudança de Estado Operativo com' +
            ' Estado Operativo “EOC”.');

    });

});



