import React, { useState, useEffect, useRef } from 'react';
import DropIn from 'braintree-web-drop-in-react';
import axios from 'axios';
import qs from 'qs';
import { API_URL } from "../../../config";
import { getToken } from '../../../utils/common';

const token = getToken('token');
const BraintreeDropIn = () => {
  const [clientToken, setClientToken] = useState(null);
  const [amount, setAmount] = useState('');
  const dropinInstance = useRef(null);

  useEffect(() => {
    // Lấy client token từ server khi component được mount
    axios.get(`${API_URL}/braintree/token`)
      .then(response => setClientToken(response.data))
      .catch(error => console.error('Lỗi khi lấy client token:', error));
  }, []);

  const handlePayment = async () => {
    if (!dropinInstance.current) {
      alert('DropIn chưa khởi tạo xong. Vui lòng thử lại sau.');
      return;
    }

    try {
      const { nonce } = await dropinInstance.current.requestPaymentMethod();
      console.log("Nonce: ", nonce);
      console.log("Amount: ", amount);

      const requestData = {
        nonce,
        amount: parseFloat(amount)
      };

      console.log("Request Data: ", requestData);

      const response = await axios.post(`${API_URL}/braintree/pay`, qs.stringify(requestData), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        alert('Nạp tiền thành công!');
      } else {
        alert('Nạp tiền thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý thanh toán:', error);
      alert('Có lỗi xảy ra khi xử lý thanh toán.');
    }
  };

  return (
    <div>
      <h1>Nạp Tiền</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Nhập số tiền"
      />
      {clientToken ? (
        <DropIn
          options={{
            authorization: clientToken,
            card: {
              cardholderName: {
                required: true
              },
              overrides: {
                fields: {
                  cvv: {
                    required: true
                  }
                }
              }
            }
          }}
          onInstance={(instance) => (dropinInstance.current = instance)}
        />
      ) : (
        <div>Đang tải Drop-in...</div>
      )}
      <button onClick={handlePayment}>Nạp Tiền</button>
    </div>
  );
};

export default BraintreeDropIn;
