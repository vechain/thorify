#!/usr/bin/env node
'use strict';

import ThorHttpProvider from '../src'
import replx = require('repl-x');
const Web3 = require('web3');

const thorProvider = new ThorHttpProvider('http://localhost:8669')
const web3 = new Web3(thorProvider);

replx.start({ prompt: 'Thor# ' }, () => { return { web3} });
