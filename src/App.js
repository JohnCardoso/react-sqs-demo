import logo from './logo.svg';
import './App.css';
import {
  SQSClient,
  AddPermissionCommand,
  ReceiveMessageCommand,
} from '@aws-sdk/client-sqs';
import { useEffect } from 'react';

function App() {
  const client = new SQSClient({
    region: 'SET_YOUR_REGION',
    credentials: {
      accessKeyId: 'SET_YOUR_IAM_ACCESS_KEY',
      secretAccessKey: 'SET_YOUR_IAM_SECRET_ACCESS_KEY',
    },
  });

  const params = {
    QueueUrl: 'YOUR_SQS_URL',
    Label: 'NAME_YOUR_LABEL',
    AWSAccountIds: ['SET_ACCOUNT_ID'],
    //Define the actions that you want to use, to the maximum of 7 actions
    Actions: ['ReceiveMessage'],
  };

  const params2 = {
    QueueUrl: 'YOUR_SQS_URL',
  };

  const receiveCommand = new ReceiveMessageCommand(params2);

  const command = new AddPermissionCommand(params);

  useEffect(() => {
    async function sqs() {
      //display and delete the messages in the SQS console
      try {
        const data = await client.send(command);
        const data2 = await client.send(receiveCommand);

        console.log(data);
        if (data2) {
          await client.send(
            new DeleteMessageCommand({
              QueueUrl: params2.QueueUrl,
              ReceiptHandle: data2.Messages[0].ReceiptHandle,
            }),
          );
        }
      } catch (error) {
        alert(error.message);
      } finally {
        console.log('terminou');
      }
    }

    sqs();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
