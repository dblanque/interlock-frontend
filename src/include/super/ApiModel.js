
class ApiModel{

    /**
     * Abstract ApiModel Constructor.
     * Override.
     * 
     * This ApiModel stuff was made by mvilche, my great friend Martin Vilche! - Dylan
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
}

export default ApiModel