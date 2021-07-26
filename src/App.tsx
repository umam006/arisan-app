import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

const abi: any = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    inputs: [],
    name: 'getLastWinner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMembers',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPollBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTheWinners',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'join',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pay',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pickWinner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'resetArisan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

let web3: Web3;
let web3Provider: any;
let arisanContract: Contract;

function App() {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    initWeb3();
  }, []);

  const initWeb3 = async () => {
    web3Provider = (await detectEthereumProvider()) as any;
    if (web3Provider) {
      web3 = new Web3(web3Provider);
      setAccounts(await web3.eth.getAccounts());

      arisanContract = new web3.eth.Contract(
        abi,
        '0x2b7746399C29e50b71961EaFD8308038cD8bcb7B'
      );
      getMemberArisan();
      getBalance();
      web3Provider.on('accountsChanged', (accounts: string[]) => {
        setAccounts(accounts);
      });
    } else {
      console.log('Metamask Belum terinstall');
    }
  };

  const connectToMetamask = async () => {
    await web3Provider.request({ method: 'eth_requestAccounts' });
  };

  const joinToArisan = async () => {
    setMessage('Tunggu beberapa saat.');
    await arisanContract.methods.join().send({ from: accounts[0] });
    setMessage('anda sudah menjadi anggota arisan.');
  };

  const pay = async () => {
    setMessage('Tunggu beberapa saat.');
    await arisanContract.methods
      .pay()
      .send({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether') });
    setMessage('anda telah berhasil membayar uang iuran.');
  };

  const getMemberArisan = async () => {
    const member = await arisanContract.methods
      .getMembers()
      .call({ from: accounts[0] });
    setMembers(member);
  };

  const getBalance = async () => {
    const balance = await arisanContract.methods
      .getPollBalance()
      .call({ from: accounts[0] });
    setBalance(Number(web3.utils.fromWei(balance, 'ether')));
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Arisan App</h1>
        <div>
          <h3>Anggota Arisan</h3>
          {/* <div>
            <button onClick={getMemberArisan}>member arisan</button>
          </div> */}
          <div>
            {members.map((member, i) => {
              return (
                <div>
                  {i + 1}. {member}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h3>Uang yang sudah terkumpul sejumlah {balance} eth</h3>
        </div>
        <div>
          {accounts.length > 0 ? (
            <h3>Wallet telah terhubung account anda adalah {accounts[0]}</h3>
          ) : (
            <button onClick={connectToMetamask}>connect to Metamask</button>
          )}
        </div>

        <div style={{ marginTop: 40 }}>
          <button onClick={joinToArisan}>Join Arisan</button>
        </div>

        <div style={{ marginTop: 40 }}>
          <button onClick={pay}>Bayar uang iuran arisan</button>
        </div>
        <div>
          <p>{message}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
