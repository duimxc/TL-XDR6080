-------fwlog抓取方法介绍--------

【基本使用方法】
1.准备好一台装有tftp的pc
2.PC通过网线连接到路由器，并保证能够ping通
3.开启pc上的tftp，并设置好fwlog的保存路径
4.在路由器的telnet端或串口输入命令：
monitor.sh fwlog <pc_ip>
pc_ip:为所连的pc的ip地址
例如：
monitor.sh fwlog 192.168.1.10
5.命令输入后，会每10s抓取一段fwlog，并tftp导出到pc，共抓取6次，脚本运行约100s，结束后可看到pc的路径有bin文件：fw_log-1.bin ~ fw_log-6.bin。

【进阶使用】
1.完整的fwlog抓取命令为：
monitor.sh fwlog <dst_ip> <round> <gap> <--ics>
-- dst_ip：指定tftp导出的pc地址，选填，默认为192.168.1.100
-- round：指定抓取的轮次，选填，默认为6
-- gap：指定每轮抓取的时间，选填，默认为10
-- ics：是否开启ics抓取，选填，默认不开
例如：
monitor.sh fwlog 192.168.1.10 10 10 --ics
抓取10*10共100s的携带ics的fwlog并导出到192.168.1.10

2.提前终止fwlog抓取：
如果想要提前终止fwlog抓取，可输入如下命令：
monitor.sh fwlog --abort

3.配置fwlogserverip和fwlogservermac：
fwlog抓取时会造成峰值性能的下降，所以如果有性能需求较高的场景，需输入如下命令：
iwpriv ra0 set fwlogserverip=<pc_ip>
iwpriv ra0 set fwlogservermac=<pc_mac>
其中pc_ip和pc_mac为fwlog导出的pc的ip和mac。

4.分析fwlog
获得fw_log.bin后，可使用工具stat_tool_20211013.exe打开。

【注意事项】
1.fwlog较大且会消耗内存，如果长期或反复抓取，容易造成路由器异常，所以尽量采用【基本使用方法】，切勿自行随意增大round和gap。
2.开启ics会造成fwlog庞大，更容易造成异常，所以默认情况下我们不会开启，如需开启，请根据实际情况咨询研发工程师
