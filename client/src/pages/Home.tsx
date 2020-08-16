import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonItem, IonInput, IonButton } from '@ionic/react';
import React, { Component } from 'react';

import SimpleStorageContract from "../contracts/SimpleStorage.json";
import getWeb3 from "../getWeb3";


class Home extends Component {
    state = { storageValue: 0, web3: null, accounts: null, contract: null, value: 0};

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3: any = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            const SimpleStorageContractVar: any = SimpleStorageContract;

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SimpleStorageContractVar.networks[networkId];
            const instance = new web3.eth.Contract(
                SimpleStorageContractVar.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance }, this.getValue);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    getValue = async () => {
        const accounts: any = this.state.accounts;
        const contract: any = this.state.contract;

        // Stores a given value, 5 by default.
        try {
            // Get the value from the contract to prove it worked.
            const response = await contract.methods.get().call();

            // Update state with the result.
            this.setState({ storageValue: response });
        }
        catch (err) {
            console.log("Error", err);
        }
    }

    setValue = async () => {
        const accounts: any = this.state.accounts;
        const contract: any = this.state.contract;
        const value: number = this.state.value;

        // Stores a given value, 5 by default.
        try {
            await contract.methods.set(value).send({ from: accounts[0] });

            // Get the value from the contract to prove it worked.
            const response = await contract.methods.get().call();

            // Update state with the result.
            this.setState({ storageValue: response });
        }
        catch (err) {
            console.log("Error", err);
        }
    };

    render() {
        if (!this.state.web3) {
            return (
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonTitle>
                        Loading Web3, accounts, and contract...
                        </IonTitle>
                    </IonCol>
                </IonRow>
            </IonGrid>
            );
        }
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Ionic-react Truffle Box</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">Ionic-react Truffle Box</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <IonTitle>
                                    The Truffle Box is installed and ready to use.
                                </IonTitle>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonTitle>
                                    The current stored value is : {this.state.storageValue}
                                </IonTitle>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonTitle size="small">
                                    Enter a value and submit the below form to change the stored value in smart contract
                                </IonTitle>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6">
                                <IonItem>
                                    <IonInput type="number" placeholder="Enter the new value" onIonChange={(e) => {this.setState({
                                        value: e.detail.value
                                    })}}> </IonInput>
                                </IonItem>
                            </IonCol>
                            <IonCol size="3">
                                <IonButton onClick={this.setValue}>
                                    Change Value
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>

        );
    }
}

export default Home;
