document.addEventListener('DOMContentLoaded', async () => {
    // ตรวจสอบว่า Web3 มีการ Inject จากเบราว์เซอร์ (เช่น MetaMask) หรือไม่
    if (typeof window.ethereum !== 'undefined') {
        // ใช้ web3.js ผ่าน MetaMask
        window.web3 = new Web3(window.ethereum);
    } else if (typeof window.web3 !== 'undefined') {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('ไม่พบ Web3 ในเบราว์เซอร์ของคุณ โปรดติดตั้ง MetaMask');
        alert('กรุณาติดตั้ง MetaMask เพื่อใช้ฟังก์ชันนี้');
        return;
    }
// ซ่อนปุ่มเช็คอิน และแสดงปุ่มเช็คเอาท์
document.querySelectorAll('.checkin-btn').forEach(button => {
    button.style.display = 'none'; // ซ่อนปุ่มเช็คอิน
});
document.querySelectorAll('.checkout-btn').forEach(button => {
    button.style.display = 'inline-block'; // แสดงปุ่มเช็คเอาท์
});
    let userAccount = null;

    // ฟังก์ชันเชื่อมต่อ MetaMask
    async function connectMetaMask() {
        if (window.ethereum) {
            try {
                // ขอการอนุญาตเชื่อมต่อบัญชีจาก MetaMask
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                userAccount = accounts[0];
                console.log('เชื่อมต่อ MetaMask สำเร็จ:', userAccount);
            } catch (error) {
                console.error('การเชื่อมต่อ MetaMask ล้มเหลว:', error);
            }
        } else {
            alert('กรุณาติดตั้ง MetaMask เพื่อใช้ฟังก์ชันนี้');
        }
    }

    // เรียกใช้ฟังก์ชันนี้เมื่อโหลดหน้าเว็บ
    await connectMetaMask();

    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "walletAddress",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "canRent",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "active",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "due",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "start",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "end",
                    "type": "uint256"
                }
            ],
            "name": "addRenter",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "walletAddress",
                    "type": "address"
                }
            ],
            "name": "checkIn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "walletAddress",
                    "type": "address"
                }
            ],
            "name": "checkOut",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "walletAddress",
                    "type": "address"
                }
            ],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "walletAddress",
                    "type": "address"
                }
            ],
            "name": "makePayment",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "walletAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "walletAddress",
                    "type": "address"
                }
            ],
            "name": "balanceOfRenter",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "walletAddress",
                    "type": "address"
                }
            ],
            "name": "getTotalDuration",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "renters",
            "outputs": [
                {
                    "internalType": "address payable",
                    "name": "walletAddress",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "canRent",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "active",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "due",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "start",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "end",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
const contractAddress = '0xDBCB338FB09fcfc8aCF3f4c41c1EBe1f409f3343'; // ที่อยู่ของ Smart Contract

const bikeRentalContract = new web3.eth.Contract(contractABI, contractAddress);




    // ดึงข้อมูลจากหน้า HTML
    //const withdrawButton = document.getElementById('withdrawButton');
    const walletButton = document.getElementById('walletButton');
    const walletAddressDisplay = document.getElementById('walletAddress');
    const payDueButton = document.getElementById('payDueButton');
    const creditAccountButton = document.getElementById('creditAccountButton');

    // ฟังก์ชันการเชื่อมต่อกระเป๋าเงิน
    walletButton.addEventListener('click', async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            walletAddressDisplay.innerText = `ที่อยู่กระเป๋าเงิน: ${userAccount}`;
        } catch (error) {
            console.error('การเชื่อมต่อกระเป๋าเงินล้มเหลว:', error);
        }
    });

    payDueButton.addEventListener('click', async () => {
        try {
            if (!userAccount) {
                alert('กรุณาเชื่อมต่อกระเป๋าเงินก่อนทำการมัดจำ');
                return;
            }
    
            // ตรวจสอบ Smart Contract
            if (!bikeRentalContract || !bikeRentalContract.methods.deposit) {
                alert('ไม่พบ Smart Contract หรือฟังก์ชัน deposit');
                console.error('ตรวจสอบ contractABI และ contractAddress');
                return;
            }
    
            // กำหนดจำนวนเงินฝาก 0.1 ETH
            const depositAmount = web3.utils.toWei('0.1', 'ether');
    
            // เรียกฟังก์ชัน deposit โดยส่ง walletAddress เป็น parameter
            await bikeRentalContract.methods.deposit(userAccount).send({
                from: userAccount,
                value: depositAmount,
            });
    
            // แสดงข้อความยืนยัน
            const outputLabel = document.getElementById('outputLabel');
            outputLabel.textContent = 'การมัดจำสำเร็จ: 0.1 ETH';
    
            alert('การมัดจำสำเร็จ!');
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error);
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    });
    
    withdrawButton.addEventListener('click', async () => {
        try {
            // ตรวจสอบว่ามีการเชื่อมต่อกระเป๋าเงินหรือยัง
            if (!userAccount) {
                alert('กรุณาเชื่อมต่อกระเป๋าเงินก่อนทำการถอนเงิน');
                return;
            }
    
            // ตรวจสอบ Smart Contract และฟังก์ชัน withdraw
            if (!bikeRentalContract || !bikeRentalContract.methods.withdraw) {
                alert('ไม่พบ Smart Contract หรือฟังก์ชัน withdraw');
                console.error('ตรวจสอบ contractABI และ contractAddress');
                return;
            }
    
            // ระบุจำนวนเงินที่ต้องการถอน (ตัวอย่าง: 0.1 ETH)
            const paymentInput = '0.1'; // ระบุค่าที่ต้องการถอน
            const withdrawAmount = web3.utils.toWei(paymentInput, 'ether'); // แปลงค่าเป็น Wei
    
            // เรียกฟังก์ชัน withdraw
            await bikeRentalContract.methods.withdraw(userAccount, withdrawAmount).send({
                from: userAccount,
            });
    
            // อัปเดตข้อความแสดงผล
            const outputLabel = document.getElementById('outputLabel');
            outputLabel.textContent = `ถอนเงินสำเร็จ: ${paymentInput} ETH`;
    
            alert('ถอนเงินสำเร็จ!');
            document.getElementById('outputLabel').textContent = '';
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการถอนเงิน:', error);
            alert('ไม่สามารถถอนเงินได้ โปรดลองอีกครั้ง');
        }
    });
    
    
    

    creditAccountButton.addEventListener('click', async () => {
        try {
            const output2Value = document.getElementById('output2').textContent;
            const cost = parseFloat(output2Value); // แปลงค่าบริการเป็นตัวเลข
    
            // ตรวจสอบว่าเชื่อมต่อกับกระเป๋าเงินแล้ว
            if (!userAccount) {
                alert('กรุณาเชื่อมต่อกระเป๋าเงินก่อนทำการชำระเงิน');
                return;
            }
    
            if (cost <= 0) {
                alert('ค่าบริการไม่ถูกต้อง');
                return;
            }
    
            // แปลงค่าบริการเป็น Wei
            const costInWei = web3.utils.toWei(cost.toString(), 'ether');
    
            // เรียกฟังก์ชัน makePayment จาก Smart Contract
            await bikeRentalContract.methods.makePayment(userAccount).send({
                from: userAccount,
                value: costInWei // จำนวนเงินค่าบริการ
            });
    
            // การจ่ายเงินสำเร็จ
            alert('การจ่ายเงินสำเร็จ!');
    
            // รีเซตค่าของ output1, output2
            document.getElementById('output1').textContent = '';
            document.getElementById('output2').textContent = '';
    
            // ซ่อนปุ่มเช็คอิน และแสดงปุ่มเช็คเอาท์
            document.querySelectorAll('.checkin-btn').forEach(button => {
                button.style.display = 'none'; // ซ่อนปุ่มเช็คอิน
            });
            document.querySelectorAll('.checkout-btn').forEach(button => {
                button.style.display = 'inline-block'; // แสดงปุ่มเช็คเอาท์
            });
    
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการจ่ายเงิน:', error);
            alert('เกิดข้อผิดพลาดในการจ่ายเงิน กรุณาลองใหม่');
        }
    });
    
    
    
    // ฟังก์ชันเช็คเอาท์จักรยาน
    let startTime = 0;

    document.querySelectorAll('.checkout-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const bikeId = event.target.getAttribute('data-bike-id');
            try {
                if (!userAccount) {
                    alert('กรุณาเชื่อมต่อกระเป๋าเงินก่อนทำการเช็คเอาท์');
                    return;
                }
    
                // บันทึกเวลาเริ่มต้น
                startTime = Date.now();
                document.getElementById('output1').textContent = "กำลังเช็คเอาท์...";
    
                // เรียกฟังก์ชัน checkOut จาก Smart Contract
                await bikeRentalContract.methods.checkOut(userAccount).send({ from: userAccount });
                
                alert(`เช็คเอาท์จักรยานหมายเลข ${bikeId} เรียบร้อยแล้ว!`);
    
                // ซ่อนปุ่ม 'เช็คเอาท์' และแสดงปุ่ม 'เช็คอิน'
                event.target.style.display = 'none';
                document.querySelector(`.checkin-btn[data-bike-id="${bikeId}"]`).style.display = 'inline-block';
    
                // อัปเดต UI หรือทำสิ่งที่เกี่ยวข้องหลังการเช็คเอาท์
                document.getElementById('output1').textContent = "เช็คเอาท์เสร็จสิ้น";
    
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการเช็คเอาท์จักรยาน:', error);
                document.getElementById('output1').textContent = "เกิดข้อผิดพลาดในการเช็คเอาท์";
            }
        });
    });
    

    // ฟังก์ชันเช็คอินจักรยาน
    document.querySelectorAll('.checkin-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const bikeId = event.target.getAttribute('data-bike-id');
            try {
                if (!userAccount) {
                    alert('กรุณาเชื่อมต่อกระเป๋าเงินก่อนทำการเช็คอิน');
                    return;
                }

                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000; // แปลงเป็นวินาที
                const minutes = Math.floor(duration / 60);       // คำนวณนาที
                const seconds = (duration % 60).toFixed(2);     // คำนวณวินาที
                //  // คำนวณค่าใช้จ่าย (ถ้าเวลาน้อยกว่า 1 นาที ให้คิดเป็น 0.01 ETH)
                 const cost = minutes < 1 ? 0.01 : minutes * 0.01;
              
                document.getElementById('output1').textContent = `${minutes} นาที ${seconds} วินาที`;
                document.getElementById('output2').textContent = `${cost} ETH`;


                // เช็คอินจักรยาน
                await bikeRentalContract.methods.checkIn(userAccount).send({ from: userAccount });
                alert(`เช็คอินจักรยานหมายเลข ${bikeId} เรียบร้อยแล้ว!`);



                // ซ่อนปุ่ม 'เช็คอิน' และแสดงปุ่ม 'เช็คเอาท์'
                event.target.style.display = 'none';
                
                document.querySelector(`.checkout-btn[data-bike-id="${bikeId}"]`).style.display = 'inline-block';

            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการเช็คอินจักรยาน:', error);
            }
        });
    });
});






