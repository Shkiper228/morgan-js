class Command {
    constructor(client ,{
        name = '',
        description = '',
        ownerOnly = false,
        adminOnly = false
    }, run) 
    
    {
        this.name = name;
        this.description = description;
        this.ownerOnly = ownerOnly;
        this.adminOnly = adminOnly;
        this.run = run;
    }
}

module.exports = Command;