require('events').EventEmitter.defaultMaxListeners = 0;
const assert = require('assert');
const ganache = require ('ganache-cli');
const Web3 = require('web3'); // Higher case because it's a constructor

const provider = ganache.provider()
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile') 

const INITIAL_MSG = 'High there!';
const NEW_MSG = 'Bye!'

let accounts;
let inbox;

beforeEach(async () => {
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts();		

	// Use one of those accounts to deploy the constract
	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data: bytecode, arguments: [INITIAL_MSG]})
		.send({ from: accounts[0], gas: '1000000'});
});

describe('Inbox', () => {
	it('deploys a contract', () => {
		assert.ok(inbox.options.address);
	});

	it('has a default message', async () => {
		const message = await inbox.methods.message().call(); // first set of parenthesis -> arguments, 
		assert.equal(message, INITIAL_MSG);					  // second set -> how the function gets called
	});

	it('can change the message', async () => {
		await inbox.methods.setMessage(NEW_MSG).send({ from: accounts[0] });
		const message = await inbox.methods.message().call();
		assert.equal(message, NEW_MSG);
	})
});







	// (tutorial) mocha testing framework 
/*
class Car {

    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

let car;

beforeEach(() => {
	car = new Car();
});

describe('Car', () => { // 'Car' is only named like that for organisational purposes

    it('can park', () => {
        assert.equal(car.park(), 'stopped');        
    });

    it('can drive', () => {
        assert.equal(car.drive(), 'vroom');
    });
});

*/ 