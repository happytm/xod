
struct State {
    Number n = 0;
    bool isDone = false;
};

{{ GENERATED_CODE }}

void evaluate(Context ctx) {
    auto state = getState(ctx);

    if (isInputDirty<input_RST>(ctx)) {
        state->isDone = false;
        state->n = 0;
    }

    if (!isInputDirty<input_NC>(ctx) || state->isDone)
        return;

    auto c = getValue<input_C>(ctx);
    if (c >= '0' && c <= '9') {
        state->n *= 10;
        state->n += c - '0';
    } else {
        state->isDone = true;
        emitValue<output_END>(ctx, 1);
    }

    emitValue<output_NUM>(ctx, state->n);
}
