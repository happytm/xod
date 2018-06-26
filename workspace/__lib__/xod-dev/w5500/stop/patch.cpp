
struct State {
};

{{ GENERATED_CODE }}

void evaluate(Context ctx) {
    if (!isInputDirty<input_STOP>(ctx))
        return;

    auto client = getValue<input_CL>(ctx);
    client->stop();
    emitValue<output_DONE>(ctx, 1);
}
