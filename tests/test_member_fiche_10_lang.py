"""Régression DIGIY : 8 langues d'origine + wolof et chinois simplifié."""
import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path

HTML = (Path(__file__).resolve().parents[1] / "index.html").read_text(encoding="utf-8")
EXPECTED = set("kicker,sub,lead,chips,main,servicesTitle,services,official,qrKicker,qrTitle,qrText,tradeLabel,tradeValue,tradeHint,zoneLabel,zoneHint,priceLabel,priceValue,priceHint,waBtn,call,request,copy,share,gallery,copied,prompt,shareText,wa,foot".split(","))
LANGS = {"fr","en","es","pt","de","it","nl","ar","wo","zh"}

class TestTenLanguages(unittest.TestCase):
    def test_buttons_and_seo(self):
        nav = re.findall(r'<button[^>]+data-lang="([^"]+)"', HTML)
        self.assertEqual(set(nav), LANGS)
        self.assertEqual(len(nav), 10)
        self.assertIn('lang="wo"', HTML)
        self.assertIn('lang="zh-CN"', HTML)
        self.assertIn('hreflang="wo"', HTML)
        self.assertIn('hreflang="zh-CN"', HTML)
        self.assertIn('rel="canonical" href="https://kourant.digiylyfe.com/"', HTML)

    def test_dictionary_completeness(self):
        m = re.search(r'const P=\{\s*wo:(\{.*?\}),\s*zh:(\{.*?\}),\s*fr:',HTML,re.S)
        self.assertIsNotNone(m, "Language dictionaries missing")
        wo,zh = (json.loads(m.group(1)),json.loads(m.group(2)))
        for d in (wo,zh):
            self.assertEqual(set(d), EXPECTED)
            for key,value in d.items():
                if isinstance(value,list):
                    self.assertTrue(value)
                    self.assertTrue(all(isinstance(v,str) and v.strip() for v in value))
                else:
                    self.assertIsInstance(value,str)
                    self.assertTrue(value.strip(), key)
        self.assertNotEqual(wo["lead"], zh["lead"])
        self.assertNotEqual(wo["wa"], zh["wa"])
        self.assertIn("0%", wo.get("foot","") + wo.get("footerBrand",""))
        self.assertIn("0%", zh.get("foot","") + zh.get("footerBrand",""))

    def test_contacts_and_qr_unchanged(self):
        self.assertIn("function profile()",HTML)
        self.assertTrue("function setQr()" in HTML or "function qr()" in HTML)
        self.assertIn("https://wa.me/", HTML)
        self.assertIn("function ownerUrl()", HTML)
        self.assertIn("lang==='zh'?'zh-CN':lang", HTML)
        self.assertIn("lang==='wo'||lang==='zh'", HTML)

    @unittest.skipUnless(shutil.which("node"), "Node not installed")
    def test_inline_javascript_syntax(self):
        scripts = re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>', HTML,re.S)
        script = next((s for s in scripts if "const P={" in s), "")
        self.assertTrue(script,"Main translation script not found")
        test=subprocess.run(["node","--check"],input=script,text=True,capture_output=True,check=False)
        self.assertEqual(test.returncode,0,test.stderr)

if __name__=="__main__":
    unittest.main()
