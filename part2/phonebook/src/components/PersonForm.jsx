const PersonForm = ({ onSubmitHandler, name, nameHandler, number, numberHandler }) => (
    <form onSubmit={onSubmitHandler}>
        <div>
            name: <input value={name} onChange={nameHandler} />
            <br />
            number: <input value={number} onChange={numberHandler} />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
)

export default PersonForm