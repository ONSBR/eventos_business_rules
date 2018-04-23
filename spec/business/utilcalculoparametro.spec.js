const UtilCalculoParametro = require('../../business/utilcalculoparametro');

describe('EventoMudancaEstadoOperativoBusiness deve:', function () {

    it('Deve calcular o intervalo em horas:', () => {
        expect(UtilCalculoParametro.calcularIntervaloEmHoras(new Date(2018, 1, 1), new Date(2018, 1, 2))).toBe(24);
        expect(UtilCalculoParametro.calcularIntervaloEmHoras(new Date(2018, 1, 1), new Date(2018, 1, 6))).toBe(120);        
    });


});



