{{#global}}
#include <SPI.h>
#include <Ethernet2.h>
{{/global}}

struct State {
};

{{ GENERATED_CODE }}

void evaluate(Context ctx) {
    if (!isInputDirty<input_INIT>(ctx))
        return;

    auto mac = getValue<input_MAC>(ctx);
    auto ip = getValue<input_IP>(ctx);

    Ethernet.begin(mac, ip);

    emitValue<output_DONE>(ctx, 1);
}
