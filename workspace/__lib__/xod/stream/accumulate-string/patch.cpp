
struct State {
    uint8_t* buff;
    size_t cursor;
    CStringView view;
};

{{ GENERATED_CODE }}

void evaluate(Context ctx) {
    auto state = getState(ctx);
    size_t cap = getValue<input_LEN>(ctx);

    if (isSettingUp()) {
        state->buff = new uint8_t[cap];
    }

    if (isSettingUp() || isInputDirty<input_RST>(ctx)) {
        state->cursor = 0;
        for (int i = 0; i < cap; i++) {
            state->buff[i] = '\0';
        }
    }

    if (isInputDirty<input_PUSH>(ctx)) {
        if (state->cursor >= (cap - 1)) {
            emitValue<output_FULL>(ctx, 1);
            return;
        }

        state->buff[state->cursor] = getValue<input_CHAR>(ctx);
        state->cursor++;
        emitValue<output_OUT2>(ctx, 1);
    }

    state->view = CStringView(state->buff);
    emitValue<output_OUT1>(ctx, XString(&state->view));
}
