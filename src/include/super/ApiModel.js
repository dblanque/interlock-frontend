
class ApiModel{

    _callsPrefix = undefined
    /**
     * Abstract ApiModel Constructor.
     * Override.
     * 
     * Contributors
     * Martín Vilche
     * Dylan Blanqué
     */
    constructor() {
        if (this.constructor === ApiModel) {
            throw new TypeError('Abstract class "ApiModel" cannot be instantiated directly.'); 
        }
    }
    
    validate(){
        throw new TypeError("The method `validate` inherited by ApiModel must be overridden."); 
    }

    getById(){
        throw new TypeError("The method `getById` inherited by ApiModel must be overridden."); 
    }

    list(){
        throw new TypeError("The method `list` inherited by ApiModel must be overridden."); 
    }

    _getEndpoint(name, pk=undefined, pkReplacePattern="{pk}") {
        if (this._callsPrefix === undefined)
            throw new TypeError("Attribute `_callsPrefix` inherited by ApiModel must be overridden."); 
        if (pk !== undefined)
            return (this._callsPrefix + name).replace(pkReplacePattern, pk)
        else
            return this._callsPrefix + name
    }
}

export default ApiModel