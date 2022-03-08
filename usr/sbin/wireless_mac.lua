#!/usr/bin/env lua

function get_iwinfo(dev)
    local iwinfo = require("iwinfo")
    local driverType = nil
    local wifiObj = nil
    
    driverType = iwinfo.type(dev)
    wifiObj = iwinfo[driverType] or nil
    
    if nil == wifiObj then
        return nil
    end
    
    return setmetatable({}, {
                            __index = function(t, k)
                                        if wifiObj[k] then
                                            return wifiObj[k](dev)
                                        end
                                    end
                        })
end

function get_iw_status()
	local ifs = {"ath0", "ath1", "ath2", "ath3"}
	local rv = {}
	
	for _, ifname in ipairs(ifs) do
		local interface = get_iwinfo(ifname)
		if interface then
			rv[#rv+1] = interface.assoclist
		end
	end
	
	return rv
end

function judge_wifi_mac(input_mac)
	local wifilist = get_iw_status()
	local wifi
	for _, wifi in ipairs(wifilist) do
		local mac
		local station		
		
		for mac, station in pairs(wifi) do
			if input_mac == mac then
				return 1
			end
		end
	end
	return 0
end

ret=judge_wifi_mac(arg[1])
print(ret)
