import React,{ useState,useEffect } from 'react';
import { Divider,Segmented,InputNumber,Button,Space,DatePicker, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams,useNavigate } from 'react-router-dom';
import {LoadingOutlined} from '@ant-design/icons';
import { $getOne} from '../../../api/detail';
import MarkDown from '../../../components/MarkDown';
import MaskLayout from '../../../components/MaskLayout';
import './Detail.scss'

//日期选择器
const { RangePicker } = DatePicker;

const Detail = () => {
    // 详情页状态
    const [detailLoadState,setDetailLoadState] = useState(0);
    //当前商品基本信息
    const [currentGoodsInfo,setCurrentGoodsInfo] = useState({});
    // 商品套餐类型
    const [comboType,setComboType] = useState([]);
    // 记录当前所选套餐
    const [currentCombo,setCurrentCombo] =useState({});
    // 当前所需套餐数量
    const [comboNumber,setComboNumber] =useState(1);
    // 记录所选日期及天数
    const [dateStrings,setDateStrings] = useState([]);
    const [days, setDays] = useState([]);
    // 获取路由参数
    const [search,setSearch] = useSearchParams();
    // 错误展示信息
    const errMsg = '无法加载商品详情，请稍后再试！';
    // 路由跳转
    const navigate = useNavigate();

    // 初始化
     useEffect(() => {
      loadDetailPageData();
    },[])
    // 加载数据
    const loadDetailPageData = async ()=>{
      try {
        const goodsTypeName = search.get('goodsTypeName');
        const goodsId = search.get('goodsId');
        let data = await $getOne(goodsTypeName,goodsId);
        data = data[0];
        setDetailLoadState(1);
         // 保存所有信息
        setCurrentGoodsInfo(data);
        // 获取套餐类型
        const type = data.detail?.comboType?.map(item => item.comboTypeName)||[]
        // 保存套餐类型
        setComboType(type);
        // 初始化当前所选套餐
        setCurrentCombo(data.detail.comboType?data.detail.comboType[0]:{});
      } catch (error) {
        setDetailLoadState(-1);
      }
    }
    // 关闭详情页
    const handleClose = ()=>{
        navigate(-1,{
          replace:true
        });
    }
    // 屏蔽部分日期
    const disabledDate = (current) => {
      // Can not select days before today and days after 30days
      if(search.get('goodsTypeName')==='hotels')
      {
        return current > dayjs().add(+29, 'd') || current < dayjs().add(-1, 'd');
      }
      else{
        return current < dayjs().add(-1, 'd');
      }
    };
    // 日历选择器处理函数
    const onRangeChange = (dates, dateStrings) => {

      if (dates) {
        if(search.get('goodsTypeName')==='hotels')
        {
          setDateStrings(dateStrings);
          setDays(dayjs(dateStrings[1]).diff(dateStrings[0],'day'));
        }
        else if(search.get('goodsTypeName')==='scenics')
        {
          //景区只能预定一天
          setDateStrings([dayjs(dates).startOf('d').format('YYYY-MM-DD HH:mm'),dayjs(dates).endOf('d').format('YYYY-MM-DD HH:mm')]);
          setDays(1);
        }
      }
      else{
        setDays(0);
        setDateStrings(['','']);
      }
    };
    // 获取当前所选商品套餐类型
    const handleComboChange = (comboTypeName)=>{
      const combo = currentGoodsInfo.detail.comboType.find(item=>item.comboTypeName === comboTypeName)||{};
      setCurrentCombo(combo)
    }
    // 获取当前所选商品数量
    const onNumberChange = (value) => {
      setComboNumber(value)
    };
    // 跳转到订单页面
    const onFinish = ()=>{
      // console.log(currentGoodsInfo)
        navigate('/home/mall/buy',{
          replace:false,
          state:{
            goodsTypeName: search.get('goodsTypeName'),
            currentGoodsInfo,
            currentCombo,
            comboNumber,
            dateStrings:search.get('goodsTypeName')==='food'?
            [dayjs().format('YYYY-MM-DD'),dayjs().add(29,'d').format('YYYY-MM-DD')]:dateStrings,
            days:search.get('goodsTypeName')==='food'?1:days
          }
      });
    }
    return (
        <MaskLayout 
        onClose = {handleClose}
        hiddenBack={true} 
        >
          {
            detailLoadState===0?<LoadingOutlined/>:
            detailLoadState===1?(
              <>
                <MarkDown src= {currentGoodsInfo?.detail?.mdUrl}/>
                <Divider orientation="left" orientationMargin="0" >请选择购买类型</Divider>
                <div className='combo'>
                <Space
                  direction="vertical"
                  size={[0, 28]}
                  style={{
                    display: 'flex',
                  }}
                >
                <Segmented block options={comboType} onChange={(comboTypeName)=>{handleComboChange(comboTypeName)}}/>
                  <div className='combo-content'>
                    <div><img className='combo-img' src={currentCombo.comboImgUrl}/> </div>
                    <div>{currentCombo.comboIntro}</div>
                    <div>价格：{currentCombo.comboPrice}</div>
                    <div>库存：{currentCombo.comboCount}</div>
                  </div>
                  <div className='choose-date'>{search.get('goodsTypeName')==='food'?'':'选择日期：'}
                  {
                    search.get('goodsTypeName')==='scenics'?
                    <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                    onChange={onRangeChange}
                    />: search.get('goodsTypeName')==='hotels'?
                    <RangePicker 
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}  
                    onChange={onRangeChange} />:<></>
                  }
                  </div>
                  <div className='select-combo-order'>
                  {search.get('goodsTypeName')==='hotels'?(<div>{dateStrings[0]&&dateStrings[1]?`${dateStrings[0]} 至 ${dateStrings[1]}，共${days}晚`:''}</div>)
                  :search.get('goodsTypeName')==='scenics'?(<div>{dateStrings[0]&&dateStrings[1]?`使用期限：${dateStrings[0]} 至 ${dateStrings[1]}`:''}</div>):''}   
                    <div className='comfirm-number'><span>购买数量：</span>
                    <InputNumber 
                    disabled={currentCombo.comboCount>0?false:true} 
                    min={currentCombo.comboCount>0?1:0} 
                    max={currentCombo?.comboCount} 
                    value = {currentCombo.comboCount?comboNumber:0}
                    onChange={onNumberChange} /></div>
                    <Tooltip trigger={'hover'} color='rgba(0,0,0,.6)' open={days>0||search.get('goodsTypeName')==='food'?false:true} placement="top" title={'请先选择日期'} >
                      <Button 
                      disabled={currentCombo.comboCount>0&&days>0||search.get('goodsTypeName')==='food'?false:true}
                      type="primary" 
                      onClick={onFinish}>{currentCombo.comboCount?'立即购买':'暂无库存'}</Button>
                    </Tooltip>
                  </div>
                  </Space>
                </div>
              </>
            ):<h1>{errMsg}</h1>
          }
        </MaskLayout>
    );
}

export default Detail;
