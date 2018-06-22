struct State {
};

// because most other IPAdress classes can cast from/to uint32_t
using Type = uint32_t;

{{ GENERATED_CODE }}

void evaluate(Context ctx) {
    auto octet1 = getValue<input_IN1>(ctx);
    auto octet2 = getValue<input_IN2>(ctx);
    auto octet3 = getValue<input_IN3>(ctx);
    auto octet4 = getValue<input_IN4>(ctx);

    uint8_t bytes[4] = { octet1, octet2, octet3, octet4 };

    emitValue<output_OUT>(ctx, *reinterpret_cast<Type*>(bytes));
}
