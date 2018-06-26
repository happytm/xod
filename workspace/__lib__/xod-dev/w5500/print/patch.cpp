
struct State {
};

{{ GENERATED_CODE }}

void evaluate(Context ctx) {
    if (!isInputDirty<input_PRN>(ctx))
        return;

    auto client = getValue<input_CL>(ctx);
    auto line = getValue<input_LINE>(ctx);

    size_t lastWriteSize;

    for (auto it = line->iterate(); it; ++it) {
        lastWriteSize = client->write((char)*it);
        if (lastWriteSize == 0) {
            emitValue<output_ERR>(ctx, 1);
            return;
        }
    }

    client->flush();

    emitValue<output_DONE>(ctx, 1);
}
