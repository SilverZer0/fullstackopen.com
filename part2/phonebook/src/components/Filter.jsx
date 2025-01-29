const Filter = ({ value, onChangeHandler }) => (
    <div>
        filter shown with <input value={value} onChange={onChangeHandler} />
    </div>
)

export default Filter