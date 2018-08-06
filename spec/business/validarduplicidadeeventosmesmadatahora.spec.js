const EventoMudancaEstadoOperativoBusiness = require('../../business/eventomudancaestadooperativobusiness');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {
    let eventoMudancaEstadoOperativoBusiness = new EventoMudancaEstadoOperativoBusiness();

    it('Restringir eventos na mesma data hora com exceção do EOC:', () => {

        let dataJaneiro = new Date(2018, 0 , 1);
        let dataFevereiro = new Date(2018, 1 , 1);
        let dataMarco = new Date(2018, 2 , 1);

        let eventosComUmEOC = [{idEvento: 1, idEstadoOperativo: 'EOC', dataVerificada: dataJaneiro },
            {idEvento: 2, idEstadoOperativo: 'LIG', dataVerificada: dataJaneiro },
            {idEvento: 3, idEstadoOperativo: 'LCS', dataVerificada: dataFevereiro },
            {idEvento: 4, idEstadoOperativo: 'LCC', dataVerificada: dataMarco}];
        eventoMudancaEstadoOperativoBusiness.verificarEventosNaMesmaDataHora(eventosComUmEOC);

        let eventosComEventosSimultaneos = [{idEvento: 1, idEstadoOperativo: 'EOC', dataVerificada: dataJaneiro },
            {idEvento: 2, idEstadoOperativo: 'LIG', dataVerificada: dataJaneiro },
            {idEvento: 3, idEstadoOperativo: 'LCS', dataVerificada: dataJaneiro },
            {idEvento: 4, idEstadoOperativo: 'LCS', dataVerificada: dataJaneiro }];

        expect(
            () => {
                eventoMudancaEstadoOperativoBusiness.verificarEventosNaMesmaDataHora(eventosComEventosSimultaneos);
            }
        ).toThrowError();

    });

});



