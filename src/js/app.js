App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originManufacturerID: "0x0000000000000000000000000000000000000000",
    originManufacturerName: null,
    originManufacturerInformation: null,
    originManufacturerLatitude: null,
    originManufacturerLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originManufacturerID = $("#originManufacturerID").val();
        App.originManufacturerName = $("#originManufacturerName").val();
        App.originManufacturerInformation = $("#originManufacturerInformation").val();
        App.originManufacturerLatitude = $("#originManufacturerLatitude").val();
        App.originManufacturerLongitude = $("#originManufacturerLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originManufacturerID, 
            App.originManufacturerName, 
            App.originManufacturerInformation, 
            App.originManufacturerLatitude, 
            App.originManufacturerLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];
        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.manufactureItem(event);
                break;
            case 2:
                return await App.manufacturerPackageItem(event);
                break;
            case 3:
                return await App.manufacturerSellItem(event);
                break;
            case 4:
                return await App.distributorBuyItem(event);
                break;
            case 5:
                return await App.manufacturerShipItem(event);
                break;
            case 6:
                return await App.distributorReceiveItem(event);
                break;
            case 7:
                return await App.distributorSellItem(event);
                break;
            case 8:
                return await App.retailerBuyItem(event);
                break;
            case 9:
                return await App.distributorShipItem(event);
                break;
            case 10:
                return await App.retailerReceiveItem(event);
                break;    
            case 11:
                return await App.retailerSellItem(event);
                break;
            case 12:
                return await App.consumerBuyItem(event);
                break;        
            case 13:
                return await App.fetchItemBufferOne(event);
                break;
            case 14:
                return await App.fetchItemBufferTwo(event);
                break;
            case 15:
                return await App.addManufacturer(event);
                break;            
            case 16:
                return await App.addDistributor(event);
                break;            
            case 17:
                return await App.addRetailer(event);
                break;            
            case 18:
                return await App.addConsumer(event);
                break;
            }                        

    },

    addConsumer: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addConsumer(App.consumerID, {from: App.ownerID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addConsumer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addRetailer: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addRetailer(App.retailerID, {from: App.ownerID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addRetailer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addDistributor: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addDistributor(App.distributorID, {from: App.ownerID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addDistributor',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addManufacturer: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addManufacturer(App.originManufacturerID, {from: App.ownerID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addManufacturer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    manufactureItem: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));        
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.manufactureItem(
                App.upc, 
                App.originManufacturerID, 
                App.originManufacturerName, 
                App.originManufacturerInformation, 
                App.originManufacturerLatitude, 
                App.originManufacturerLongitude, 
                App.productNotes,
                {from: App.originManufacturerID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('manufactureItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    manufacturerPackageItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packageItem(App.upc, {from: App.originManufacturerID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('manufacturer - packageItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    manufacturerSellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        
        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(".0000001", "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem(App.upc, App.productPrice, {from: App.originManufacturerID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('manufacturer - sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    distributorBuyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(".0000002", "ether");
            return instance.buyItem(App.upc, {from: App.distributorID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('distributor - buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    manufacturerShipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.upc, {from: App.originManufacturerID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('manufacturer - shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    distributorReceiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc, {from: App.distributorID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('distributor - receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },   

    distributorSellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(.0000002, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem(App.upc, App.productPrice, {from: App.distributorID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('distributor - sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    retailerBuyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(".0000004", "ether");
            return instance.buyItem(App.upc, {from: App.retailerID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('retailer - buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    distributorShipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.upc, {from: App.distributorID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('dsitrbutor - shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    retailerReceiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc, {from: App.retailerID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('retailer - receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },   
    
    retailerSellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(.0000003, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem(App.upc, App.productPrice, {from: App.retailerID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('retailer - sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    consumerBuyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(".0000004", "ether");
            return instance.buyItem(App.upc, {from: App.consumerID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('consumer - buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },


    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
