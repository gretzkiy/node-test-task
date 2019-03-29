const fs = require('fs');
const config = require('../config.js');
const pathToDataFile = config.development.pathToDataFile;

class UserService {
    constructor() {
        if (UserService.__instance) {
            return UserService.__instance;
        }

        UserService.__instance = this;
    }

    /**
     * Возвращет массив всех пользователей или пустой массив, если пользователей нет
     * @returns {[]|{id: Number, name: String, age: Number}[]}
     */
    getUsers() {
        const rawdata = fs.readFileSync(pathToDataFile, {encoding: 'utf8'});
        let usersData = [];

        try {
            usersData = JSON.parse(rawdata).sort((a, b) => {
                return a.id - b.id;
            });
        } catch (error) {
            usersData = [];
        }

        return usersData;
    }

    /**
     * Возвращает данные пользователя по ID или пустой объект, если пользователь не найден
     * @param {number} id - ID пользователя для получения его данных
     * @returns {{}|{id: Number, name: String, age: Number}}
     */
    getUser(id) {
        if (!id) {
            return {};
        }

        let userId = Number(id);
        if (!userId) {
            return {};
        }

        const users = this.getUsers();
        const userData = users.find((item) => {
            return item.id === userId;
        });
        if (!userData) {
            return {};
        }

        return userData;
    }

    /**
     * Добавляет нового пользователя. Возвращает его данные или пустой объект, если не добавлен
     * @param {Object} userData - Данные нового пользователя
     * @param {String} userData.name - Имя нового пользователя
     * @param {Number} userData.age - Возраст нового пользователя
     * @returns {{}|{id: Number, name: String, age: Number}}
     */
    newUser({ name, age }) {
        let users = this.getUsers();
        let userData = {
            id: users.length ? (users[users.length - 1].id + 1) : 1,
            name,
            age: Number(age),
        };
        users.push(userData);

        try {
            fs.writeFileSync(pathToDataFile, JSON.stringify(users), {encoding: 'utf8'});
        } catch {
            userData = {};
        }

        return userData;
    }

    /**
     * Редактирует данные пользователя. Возвращает его новые данные или пустой объект, если не изменен
     * @param {Object} userData - Новые данные пользователя
     * @param {Number} userData.id - ID пользователя для редактирования
     * @param {String} userData.name - Новое имя пользователя
     * @param {Number} userData.age - Новый возраст пользователя
     * @returns {{}|{id: Number, name: String, age: Number}}
     */
    editUser({ name, age, id }) {
        let users = this.getUsers();
        let newUserData = {
            id: Number(id),
            name,
            age: Number(age),
        };

        const indexOfOldUserData = users.findIndex((item) => {
            return item.id === newUserData.id;
        });
        if (indexOfOldUserData === -1) {
            return {};
        }


        users[indexOfOldUserData] = newUserData;
        try {
            fs.writeFileSync(pathToDataFile, JSON.stringify(users), {encoding: 'utf8'});
        } catch {
            newUserData = {};
        }
        return newUserData;

    }

    /**
     * Удаляет пользователя. Возвращает его ID или null в случае ошибки удаления
     * @param {Number} id - ID пользователя для удаления
     * @returns {Number|null}
     */
    deleteUser(id) {
        if (!id) {
            return {};
        }

        let userId = Number(id);
        if (!userId) {
            return {};
        }

        const oldUsers = this.getUsers();
        let newUsers = oldUsers.filter((user) => {
            return user.id != userId;
        });

        try {
            fs.writeFileSync(pathToDataFile, JSON.stringify(newUsers), {encoding: 'utf8'});
        } catch {
            userId = null;
        }

        return userId;
    }
}

module.exports = UserService;