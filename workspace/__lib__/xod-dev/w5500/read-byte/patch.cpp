
struct State {
};

{{ GENERATED_CODE }}

void evaluate(Context ctx) {
    if (!isInputDirty<input_READ>(ctx))
        return;

    auto client = getValue<input_CL>(ctx);
    uint8_t b = client->read();

    emitValue<output_B>(ctx, b);
    emitValue<output_DONE>(ctx, 1);
}
