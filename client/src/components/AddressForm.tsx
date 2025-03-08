import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  useEffect(() => {
    // Lấy danh sách tỉnh/thành phố khi component mount
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    const response = await axios.get('/api/address/provinces');
    setProvinces(response.data);
  };

  const fetchDistricts = async (provinceId) => {
    const response = await axios.get(`/api/address/districts/${provinceId}`);
    setDistricts(response.data);
    setSelectedDistrict('');
    setWards([]);
  };

  const fetchWards = async (districtId) => {
    const response = await axios.get(`/api/address/wards/${districtId}`);
    setWards(response.data);
    setSelectedWard('');
  };

  const handleAddressDetailChange = async (value) => {
    setAddressDetail(value);
    if (value.length > 2) {
      const response = await axios.get('/api/address/suggest', {
        params: {
          province: selectedProvince,
          district: selectedDistrict,
          ward: selectedWard,
          keyword: value,
        },
      });
      setSuggestions(response.data);
    }
  };

  return (
    <div>
      <select
        value={selectedProvince}
        onChange={(e) => {
          setSelectedProvince(e.target.value);
          fetchDistricts(e.target.value);
        }}
      >
        <option value="">Chọn Tỉnh/Thành phố</option>
        {provinces.map((province) => (
          <option key={province.id} value={province.id}>
            {province.name}
          </option>
        ))}
      </select>

      <select
        value={selectedDistrict}
        onChange={(e) => {
          setSelectedDistrict(e.target.value);
          fetchWards(e.target.value);
        }}
        disabled={!selectedProvince}
      >
        <option value="">Chọn Quận/Huyện</option>
        {districts.map((district) => (
          <option key={district.id} value={district.id}>
            {district.name}
          </option>
        ))}
      </select>

      <select
        value={selectedWard}
        onChange={(e) => setSelectedWard(e.target.value)}
        disabled={!selectedDistrict}
      >
        <option value="">Chọn Phường/Xã</option>
        {wards.map((ward) => (
          <option key={ward.id} value={ward.id}>
            {ward.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={addressDetail}
        onChange={(e) => handleAddressDetailChange(e.target.value)}
        placeholder="Nhập địa chỉ chi tiết"
        disabled={!selectedWard}
      />

      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => setAddressDetail(suggestion.description)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressForm; 