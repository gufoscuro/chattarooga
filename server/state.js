var _ = require('lodash');

class Users {
    constructor() {
        this.users = []
    }

    exists(username){
        return this.users.indexOf(username) !== -1
    }

    push(username){
        if(this.exists(username))
            return false
        else { 
            this.users.push(username)
            return true
        }
    }

    remove(username) {
        if(this.exists(username)) {
            this.users = _.remove(this.users,username)
            return true
        } else
            return false
    }
}

class Rooms {
    constructor() {
        this.rooms = []
    }

    get(name) {
        return this.rooms.find(room => room.name === name)
    }

    exists(name){
        return this.get(name) !== undefined
    }
    push(name) {
        if(this.exists(name))
            return false
        else {
            this.rooms.push({'name':name,users: new Users()})
            return true
        }
    }
    remove(name){
        if(this.exists(name))
            return false
        else {
            this.rooms = this.rooms.filter(room => room.name !== name)
            return true
        }
    }
    pushUser(name,username) {
        if(!this.exists(name))
            this.push(name)
        const room = this.get(name)
        room.users.push(username)
    }

    removeUser(name,username){
        if(this.exists(name)){
            const room = this.get(name)
            return room.users.remove(username)
        } else
            return false
    }

    disconnectUser(username){
        console.log('Disconnecting user `'+username+'` from channel')
        return this.rooms.map(room => {
                        return new Promise((resolve,reject) => {
                                if(this.removeUser(room.name,username)){
                                    resolve(room.name)
                                }
                                else
                                    resolve()
                            })
                        })
    }

    hasUser(name,username){
        if(this.exists(name))
            return this.get(name).users.exists(username)
        else
            return false
    }
}

const rooms = new Rooms()
const users = new Users()

module.exports = {
    'users': users,
    'rooms': rooms
}