const _ = require('lodash');
const rp = require('request-promise')

const animals = ['dog','cat','elephant','crow','ant','cow','donkey','owl','finch','woodcock','capybara','bat','kiwi','kangaroo','chicken','sheep',
                 'turtle','fish','shark','hedgehog','dingo','lynx','rabbit','mouse','rat','hamster','fox','coyote','cockatoo','cockroach','goat']
const others = ['house','thug','boy','girl','book','car','medicine','toddler','window','shoe']
/**
 * A collection of users
 */
class Users {
    constructor() {
        this.users = []
    }

    /**
     * Generates a random weird name that needs to be unique in the system
     * @returns {String} the generated name
     */
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

    /**
     * Checks whether a username is logged in or not
     * @param {String} username 
     * @returns {Boolean} true if the user exists
     */
    exists(username){
        return this.users.indexOf(username) !== -1
    }

    /**
     * Adds a username to the collection
     * @param {String} username the username
     * @returns {Boolean} true if the user has been added, false if the user was already present
     */
    push(username){
        if(this.exists(username))
            return false
        else { 
            this.users.push(username)
            return true
        }
    }

    /**
     * Removes a username from the collection
     * @param {String} username the username
     * @returns {Boolean} true if the username has been removed. False if the user wasn't in the collection
     */
    remove(username) {
        if(this.exists(username)) {
            _.remove(this.users,username)
            return true
        } else
            return false
    }
}

/**
 * A collection fo rooms
 */
class Rooms {
    constructor() {
        this.rooms = []
    }

    /**
     * Retrieves a room by name
     * @param {String} name the name of the room
     * @returns {Object} the room or null
     */
    get(name) {
        return this.rooms.find(room => room.name === name)
    }

    /**
     * Checks whether a room exists
     * @param {String} name the name of the room
     * @returns {Boolean} true if the room exists
     */
    exists(name){
        return this.get(name) !== undefined
    }
    /**
     * Pushes a new room to the collection
     * @param {String} name the name of the room
     */
    push(name) {
        if(this.exists(name))
            return false
        else {
            this.rooms.push({'name':name,users: new Users()})
            return true
        }
    }
    /**
     * Removes a room
     * @param {String} name the name of the room
     * @returns {Boolean} true if the room was removed. False if the room was not found
     */
    remove(name){
        if(this.exists(name))
            return false
        else {
            this.rooms = this.rooms.filter(room => room.name !== name)
            return true
        }
    }
    /**
     * Pushes are username to a room. If the room does not exist, it is created
     * @param {String} name  the name of the room
     * @param {String} username the username
     */
    pushUser(name,username) {
        if(!this.exists(name))
            this.push(name)
        const room = this.get(name)
        room.users.push(username)
    }

    /**
     * Removes a username from a room
     * @param {String} name name of the room
     * @param {String} username the username
     * @returns {Boolean} true if the username has been removed. False if the room does not exist or the user does not exist
     */
    removeUser(name,username){
        if(this.exists(name)){
            const room = this.get(name)
            return room.users.remove(username)
        } else
            return false
    }

    /**
     * Disconnects a username from all rooms
     * @param {String} username the username to disconnect
     * @returns {Promise} a promise that disconnects the user
     */
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

    /**
     * Checks whether a room has a username in it
     * @param {String} name name of the room
     * @param {String} username the username
     * @returns {Boolean} true if the user is present in the room. False otherwise
     */
    hasUser(name,username){
        if(this.exists(name))
            return this.get(name).users.exists(username)
        else
            return false
    }
}

/**
 * The rooms
 */
const rooms = new Rooms()
/**
 * The users
 */
const users = new Users()

module.exports = {
    'users': users,
    'rooms': rooms
}