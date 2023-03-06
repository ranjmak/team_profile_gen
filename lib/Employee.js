// code to define and export the Employee class
class Employee {
    constructor(name, id, email) {
        // the following tests are to validate the call to the Employee constructor
        // we ensur that if any parameters to the constructor are missing, we return undefined only for that property.
        if (!name && !id && !email) {
            this.name = undefined;
            this.id = undefined;
            this.email = undefined;
        } else if (name && !id && !email) {
            if (typeof(name) === "string") {
                this.name = name;
                this.id = undefined;
                this.email = undefined;
            };
        } else if (!name && id && !email) {
            if (!isNaN(id)) {
                this.name = undefined;
                this.id = id; 
                this.email = undefined;
            };
        } else if (!name && !id && email) { // email can be validated to check for an @ and a . but this should 
                                            // really be validated at the promptUser input!
            if (typeof(email) === "string") {
                this.name = undefined;
                this.id = undefined;
                this.email = email;
            };
        };

        this.name = name;
        this.id = id;
        this.email = email;
    }
  
    getName() {
      return this.name;
    }
  
    getId() {
      return this.id;
    }
  
    getEmail() {
      return this.email;
    }
  
    getRole() {
      return 'Employee';
    }
};

module.exports = Employee;
