'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        this.ctx.body = 'hello egg';
    }

    async demo() {
        await this.ctx.render('demo.html')
    }

    async demo2() {
        await this.ctx.render('demo2.html')
    }
}

module.exports = HomeController;
