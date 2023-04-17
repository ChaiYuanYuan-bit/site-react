import { Empty } from "antd"
export const renderEmpty = () => (
    <Empty
        image="http://localhost:3000/hoppscotch.svg"
        imageStyle={{
            opacity:.3,
            height: 50,
        }}
        description={
            <span>
            </span>
        }
    >
    </Empty>
)