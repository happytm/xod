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
    auto csPin = getValue<input_CS>(ctx);

    Ethernet.init(csPin);

#if defined(WIZ550io_WITH_MACADDRESS)
    if (Ethernet.begin() == 0) {
#else
    if (Ethernet.begin(mac) == 0) {
#endif
        emitValue<output_ERR>(ctx, 1);
    } else {
        auto localIP = (xod__net__ip_address::Type)(Ethernet.localIP());

        emitValue<output_IP>(ctx, localIP);
        emitValue<output_DONE>(ctx, 1);
    }
}
