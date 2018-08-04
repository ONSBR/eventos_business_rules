const extensions = require("./extensions");
class UtilCalculoParametro {

    static isCampoStringPreenchido(campo) {
        return campo != undefined && (campo != '' || campo != "");
    }

}

module.exports = UtilCalculoParametro;
