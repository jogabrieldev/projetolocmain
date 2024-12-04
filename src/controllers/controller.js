const response = require('../model/index')

class control  {
    submitStart(){
        response.start()
    }
}

module.exports = new control()
