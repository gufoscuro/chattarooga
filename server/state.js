const _ = require('lodash');
const rp = require('request-promise')

const animals = ['dog','cat','elephant','crow','ant','cow','donkey','owl','finch','woodcock','capybara','bat','kiwi','kangaroo','chicken','sheep',
                 'turtle','fish','shark','hedgehog','dingo','lynx','rabbit','mouse','rat','hamster','fox','coyote','cockatoo','cockroach','goat']
const others = ['house','thug','boy','girl','book','car','medicine','toddler','window','shoe']

class Users {
    constructor() {
        this.users = []
    }

    generateName() {
        const animal = animals[Math.floor(Math.random() * animals.length)]
        const thing = others[Math.floor(Math.random() * others.length)]
        return rp.get('https://api.datamuse.com/words?rel_jjb='+thing)
                    .catch((data) => {
                        console.log(data)
                    })
                    .then((data) => {
                        const parsedData = JSON.parse(data)
                        return parsedData[Math.floor(Math.random() * parsedData.length)].word+' '+animal
                    }).then((data) => {
                        if(this.exists(data))
                            return this.generateName()
                        else
                            return data
                    })
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
            _.remove(this.users,username)
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